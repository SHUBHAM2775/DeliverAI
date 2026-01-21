"""
Genetic Algorithm (GA) optimization layer for delivery slot recommendations.

The GA refines slot selection using ML-predicted success probabilities and risk scores.
It does NOT predict outcomes; it only optimizes which slots to recommend under
hard constraints and a fitness function.

Chromosome: ordered list of slot dicts. Length = top_n_per_day × number_of_days.
  - Each gene = one slot object (dict with date, slot, hour, success_probability, risk_score, ...).
  - Example: [slot_1, slot_2, ..., slot_56] for 7 days × 8 slots/day.

Fitness:
  fitness = (mean(success_probability) × 0.6) - (mean(risk_score) × 0.3) + (slot_adherence_bonus × 0.1)
  - Slot adherence: +5 per slot within sender hours; +3 if firstAttemptSuccess; -5 if deliveryAttemptCount>1; -3 if failedDeliveryRate>0.1.
  - Hard-constraint violations → fitness = -infinity.

Mutation: 10% per gene. Types: (1) replace with another valid slot from same date; (2) swap with slot of hour±1 on same date.
"""

from __future__ import annotations

import math
import random
from collections import defaultdict
from typing import Any


# ---------------------------------------------------------------------------
# Hard constraints
# ---------------------------------------------------------------------------

def _slot_id(s: dict) -> tuple[str, str]:
    return (str(s.get("date", "")), str(s.get("slot", "")))


def _in_sender_hours(slot: dict, sender: dict) -> bool:
    """True if slot hour is within [startHour, endHour)."""
    h = slot.get("hour")
    if h is None:
        return False
    try:
        h = int(h)
    except (TypeError, ValueError):
        return False
    start = sender.get("startHour")
    end = sender.get("endHour")
    if start is None:
        start = 0
    if end is None:
        end = 24
    return start <= h < end


def _filter_by_hard_constraints(
    slots: list[dict],
    sender: dict,
    top_n_per_day: int,
) -> dict[str, list[dict]]:
    """
    Filter slots by: startHour <= hour < endHour.
    Returns pool_by_date: { date: [slot, ...] }.
    """
    pool: dict[str, list[dict]] = defaultdict(list)
    for s in slots:
        if not _in_sender_hours(s, sender):
            continue
        d = str(s.get("date", ""))
        if not d:
            continue
        pool[d].append(s)
    return dict(pool)


def _check_hard_constraints(
    chromosome: list[dict],
    sender: dict,
    top_n_per_day: int,
) -> bool:
    """True if no hard-constraint violation."""
    seen: set[tuple[str, str]] = set()
    by_date: dict[str, int] = defaultdict(int)
    for s in chromosome:
        sid = _slot_id(s)
        if sid in seen:
            return False
        seen.add(sid)
        if not _in_sender_hours(s, sender):
            return False
        by_date[str(s.get("date", ""))] += 1
    for _d, c in by_date.items():
        if c > top_n_per_day:
            return False
    return True


# ---------------------------------------------------------------------------
# Fitness
# ---------------------------------------------------------------------------

def _fitness(
    chromosome: list[dict],
    sender: dict,
    top_n_per_day: int,
) -> float:
    """
    fitness = (mean(success_probability) × 0.6) - (mean(risk_score) × 0.3) + (slot_adherence_bonus × 0.1)

    Slot adherence:
      +5 per slot within sender working hours (already enforced by filter; we still count)
      +3 if sender/order firstAttemptSuccess is True
      -5 if deliveryAttemptCount > 1
      -3 if sender failedDeliveryRate > 0.1
    """
    if not chromosome:
        return -math.inf

    if not _check_hard_constraints(chromosome, sender, top_n_per_day):
        return -math.inf

    # Mean success and risk
    success_sum = 0.0
    risk_sum = 0.0
    for s in chromosome:
        success_sum += float(s.get("success_probability", 0) or 0)
        risk_sum += float(s.get("risk_score", 0) or 0)
    n = len(chromosome)
    mean_success = success_sum / n
    mean_risk = risk_sum / n

    # Slot adherence bonus
    in_hours_bonus = 5 * sum(1 for s in chromosome if _in_sender_hours(s, sender))
    first_attempt = 3 if sender.get("firstAttemptSuccess") is True else 0
    attempt_penalty = -5 if (sender.get("deliveryAttemptCount") or 0) > 1 else 0
    fail_rate_penalty = -3 if (float(sender.get("failedDeliveryRate") or 0)) > 0.1 else 0
    slot_adherence_bonus = in_hours_bonus + first_attempt + attempt_penalty + fail_rate_penalty

    return (mean_success * 0.6) - (mean_risk * 0.3) + (slot_adherence_bonus * 0.1)


# ---------------------------------------------------------------------------
# Pool and chromosome building
# ---------------------------------------------------------------------------

def _build_chromosome(
    pool_by_date: dict[str, list[dict]],
    top_n: int,
) -> list[dict]:
    """Build one random chromosome: for each date, choose up to top_n slots without replacement."""
    out: list[dict] = []
    for d in sorted(pool_by_date.keys()):
        arr = list(pool_by_date[d])
        k = min(top_n, len(arr))
        if k <= 0:
            continue
        chosen = random.sample(arr, k)
        out.extend(chosen)
    return out


def _repair(
    child: list[dict],
    pool_by_date: dict[str, list[dict]],
    top_n: int,
) -> list[dict]:
    """
    After crossover: remove duplicates, enforce max top_n per date, fill shortage from pool.
    """
    by_date: dict[str, list[dict]] = defaultdict(list)
    seen: set[tuple[str, str]] = set()
    for s in child:
        sid = _slot_id(s)
        if sid in seen:
            continue
        seen.add(sid)
        d = str(s.get("date", ""))
        if d:
            by_date[d].append(s)

    out: list[dict] = []
    for d in sorted(pool_by_date.keys()):
        have = by_date.get(d, [])
        # Dedup (already done above; have is unique)
        # Trim to top_n
        if len(have) > top_n:
            have = random.sample(have, top_n)
        ids_in = {_slot_id(s) for s in have}
        # Fill from pool
        for s in pool_by_date[d]:
            if len(have) >= top_n:
                break
            if _slot_id(s) not in ids_in:
                have.append(s)
                ids_in.add(_slot_id(s))
        have.sort(key=lambda x: (x.get("hour") is not None, x.get("hour", 0)))
        out.extend(have)
    return out


# ---------------------------------------------------------------------------
# Crossover and mutation
# ---------------------------------------------------------------------------

def _crossover(
    p1: list[dict],
    p2: list[dict],
    pool_by_date: dict[str, list[dict]],
    top_n: int,
) -> list[dict]:
    """Single-point crossover. Child may have duplicates or wrong counts; repair."""
    if len(p1) != len(p2) or len(p1) == 0:
        return list(p1)
    k = random.randint(1, len(p1) - 1)
    child = list(p1[:k]) + list(p2[k:])
    return _repair(child, pool_by_date, top_n)


def _mutate(
    chrom: list[dict],
    pool_by_date: dict[str, list[dict]],
    top_n: int,
    prob: float = 0.10,
) -> None:
    """In-place. With prob per gene: replace with another valid (same date) or swap with hour±1."""
    for i in range(len(chrom)):
        if random.random() > prob:
            continue
        s = chrom[i]
        d = str(s.get("date", ""))
        if d not in pool_by_date:
            continue
        hour = s.get("hour")
        try:
            h = int(hour) if hour is not None else None
        except (TypeError, ValueError):
            h = None

        ids_in = {_slot_id(x) for j, x in enumerate(chrom) if j != i}
        # 1) Replace: pick from pool[d] not in chrom (excluding current)
        replace_candidates = [x for x in pool_by_date[d] if _slot_id(x) not in ids_in]
        if replace_candidates:
            chrom[i] = random.choice(replace_candidates)
            continue
        # 2) Shift ±1: find in chrom a slot with same date and hour h±1; swap
        if h is not None:
            for j, o in enumerate(chrom):
                if i == j:
                    continue
                if str(o.get("date", "")) != d:
                    continue
                oh = o.get("hour")
                try:
                    oh = int(oh) if oh is not None else None
                except (TypeError, ValueError):
                    oh = None
                if oh is not None and (oh == h + 1 or oh == h - 1):
                    chrom[i], chrom[j] = chrom[j], chrom[i]
                    break


# ---------------------------------------------------------------------------
# Selection and main loop
# ---------------------------------------------------------------------------

def _tournament_select(
    population: list[list[dict]],
    fitnesses: list[float],
    k: int = 3,
) -> list[dict]:
    """Tournament selection: pick k random, return the one with best fitness."""
    n = len(population)
    idx = random.randint(0, n - 1)
    best = fitnesses[idx]
    for _ in range(k - 1):
        j = random.randint(0, n - 1)
        if fitnesses[j] > best:
            idx = j
            best = fitnesses[j]
    return list(population[idx])


def optimize_slots(
    predicted_slots: list[dict[str, Any]],
    sender_profile: dict[str, Any],
    top_n_per_day: int,
) -> list[dict[str, Any]]:
    """
    Run GA to optimize slot selection from ML-predicted slots.

    Args:
        predicted_slots: Flat list of slot dicts (each has date, slot, hour, success_probability, risk_score, ...).
        sender_profile: { startHour, endHour, failedDeliveryRate?, firstAttemptSuccess?, deliveryAttemptCount? }.
        top_n_per_day: Max slots per date (e.g. 8).

    Returns:
        Optimized list of slot dicts in the same format as input. Deterministic if random.seed(42) is set before call.
    """
    # Flatten if passed recommendations_by_date structure
    if isinstance(predicted_slots, dict) and "recommendations_by_date" in predicted_slots:
        flat: list[dict] = []
        for date, arr in (predicted_slots.get("recommendations_by_date") or {}).items():
            flat.extend(arr if isinstance(arr, list) else [])
        predicted_slots = flat
    elif isinstance(predicted_slots, dict):
        flat = []
        for arr in predicted_slots.values():
            if isinstance(arr, list):
                flat.extend(arr)
        predicted_slots = flat

    if not predicted_slots:
        return []

    pool_by_date = _filter_by_hard_constraints(predicted_slots, sender_profile, top_n_per_day)
    if not pool_by_date:
        return []

    # Infer number of days and target length
    n_days = len(pool_by_date)
    target_len = top_n_per_day * n_days

    # Build initial population (50)
    population: list[list[dict]] = []
    for _ in range(50):
        c = _build_chromosome(pool_by_date, top_n_per_day)
        if len(c) > 0:
            population.append(c)
    if not population:
        return list(predicted_slots)[:target_len]

    # Ensure we have 50 (duplicate if needed)
    while len(population) < 50:
        population.append(list(random.choice(population)))

    # Generations: 40
    for _gen in range(40):
        fitnesses = [_fitness(c, sender_profile, top_n_per_day) for c in population]
        # Sort by fitness descending (best first); O(N log N)
        ordering = sorted(range(len(population)), key=lambda i: fitnesses[i], reverse=True)
        next_pop: list[list[dict]] = []
        # Keep best 2 (elitism)
        next_pop.append(list(population[ordering[0]]))
        next_pop.append(list(population[ordering[1]]))
        # Fill rest by selection, crossover, mutation
        for _ in range(50 - 2):
            p1 = _tournament_select(population, fitnesses)
            p2 = _tournament_select(population, fitnesses)
            child = _crossover(p1, p2, pool_by_date, top_n_per_day)
            _mutate(child, pool_by_date, top_n_per_day, prob=0.10)
            next_pop.append(child)
        population = next_pop

    fitnesses = [_fitness(c, sender_profile, top_n_per_day) for c in population]
    best_i = max(range(len(population)), key=lambda i: fitnesses[i])
    best = population[best_i]

    # Sort by date then hour for stable output
    best.sort(key=lambda s: (str(s.get("date", "")), (s.get("hour") is not None, s.get("hour", 0))))
    return best


# ---------------------------------------------------------------------------
# Example invocation
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import json

    # Optional: deterministic run
    random.seed(42)

    # Sample: load from a recommendation file or use a small in-memory list
    sample_slots = [
        {"date": "2026-01-21", "slot": "10-11", "hour": 10, "success_probability": 98.63, "risk_score": 1.37, "day_name": "Wednesday", "period": "Morning"},
        {"date": "2026-01-21", "slot": "11-12", "hour": 11, "success_probability": 88.62, "risk_score": 11.38, "day_name": "Wednesday", "period": "Morning"},
        {"date": "2026-01-21", "slot": "12-13", "hour": 12, "success_probability": 87.61, "risk_score": 12.39, "day_name": "Wednesday", "period": "Afternoon"},
        {"date": "2026-01-21", "slot": "13-14", "hour": 13, "success_probability": 87.13, "risk_score": 12.87, "day_name": "Wednesday", "period": "Afternoon"},
        {"date": "2026-01-21", "slot": "14-15", "hour": 14, "success_probability": 86.75, "risk_score": 13.25, "day_name": "Wednesday", "period": "Afternoon"},
        {"date": "2026-01-21", "slot": "15-16", "hour": 15, "success_probability": 87.23, "risk_score": 12.77, "day_name": "Wednesday", "period": "Afternoon"},
        {"date": "2026-01-21", "slot": "16-17", "hour": 16, "success_probability": 86.57, "risk_score": 13.43, "day_name": "Wednesday", "period": "Afternoon"},
        {"date": "2026-01-21", "slot": "17-18", "hour": 17, "success_probability": 82.99, "risk_score": 17.01, "day_name": "Wednesday", "period": "Evening"},
        {"date": "2026-01-22", "slot": "10-11", "hour": 10, "success_probability": 100.0, "risk_score": 0.0, "day_name": "Thursday", "period": "Morning"},
        {"date": "2026-01-22", "slot": "11-12", "hour": 11, "success_probability": 91.49, "risk_score": 8.51, "day_name": "Thursday", "period": "Morning"},
        {"date": "2026-01-22", "slot": "12-13", "hour": 12, "success_probability": 90.0, "risk_score": 10.0, "day_name": "Thursday", "period": "Afternoon"},
        {"date": "2026-01-22", "slot": "13-14", "hour": 13, "success_probability": 89.0, "risk_score": 11.0, "day_name": "Thursday", "period": "Afternoon"},
        {"date": "2026-01-22", "slot": "14-15", "hour": 14, "success_probability": 88.0, "risk_score": 12.0, "day_name": "Thursday", "period": "Afternoon"},
        {"date": "2026-01-22", "slot": "15-16", "hour": 15, "success_probability": 87.0, "risk_score": 13.0, "day_name": "Thursday", "period": "Afternoon"},
        {"date": "2026-01-22", "slot": "16-17", "hour": 16, "success_probability": 86.0, "risk_score": 14.0, "day_name": "Thursday", "period": "Afternoon"},
        {"date": "2026-01-22", "slot": "17-18", "hour": 17, "success_probability": 85.0, "risk_score": 15.0, "day_name": "Thursday", "period": "Evening"},
    ]

    sender = {"startHour": 9, "endHour": 21, "failedDeliveryRate": 0.05, "firstAttemptSuccess": True, "deliveryAttemptCount": 1}

    result = optimize_slots(sample_slots, sender, top_n_per_day=8)
    print("optimize_slots(sample_slots, sender, top_n_per_day=8)")
    print(f"  input slots: {len(sample_slots)}, output: {len(result)}")
    for s in result[:4]:
        print(f"    {s.get('date')} {s.get('slot')}  success={s.get('success_probability')}  risk={s.get('risk_score')}")
    if len(result) > 4:
        print("    ...")

    # Example with full recommendation JSON
    try:
        with open("recommendation_af8225e9-9e33-4c89-ace4-6f9e6148970d.json") as f:
            data = json.load(f)
        by_date = data.get("recommendations_by_date") or {}
        flat = []
        for arr in by_date.values():
            flat.extend(arr)
        out = optimize_slots(flat, {"startHour": 9, "endHour": 21}, top_n_per_day=8)
        print(f"\nFrom file: input {len(flat)} → output {len(out)}")
    except FileNotFoundError:
        print("\n(Skip file example: recommendation_af8225e9-9e33-4c89-ace4-6f9e6148970d.json not found)")
