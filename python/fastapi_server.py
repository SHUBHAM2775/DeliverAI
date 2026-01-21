"""
FastAPI server: GET /api/slots/recommend/{uuid}
Validates UUID via MongoDB (unique_links), fetches Order & Sender profile,
calls recommend_delivery_slots (ML), saves to JSON, returns RecommendationsResponse.
Run from the python/ folder: python fastapi_server.py  OR  uvicorn fastapi_server:app --reload --port 8000
"""

import json
import os
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

from bson import ObjectId
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient

from api import recommend_delivery_slots
from genetic_slot_optimizer import optimize_slots

app = FastAPI(title="Delivery Slot ML API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://shubhamu1332:12345@rubix.a8hul0j.mongodb.net/Rubix?retryWrites=true&w=majority&appName=RUBIX")


def get_db():
    client = MongoClient(MONGODB_URI)
    path = (urlparse(MONGODB_URI).path or "").strip("/")
    db_name = path or os.getenv("MONGODB_DB", "rubix")
    return client.get_database(db_name)


def has_lat_lon(obj) -> bool:
    if not obj or not isinstance(obj, dict):
        return False
    la, lo = obj.get("latitude"), obj.get("longitude")
    return la is not None and lo is not None and (
        isinstance(la, (int, float)) and isinstance(lo, (int, float))
    )


def _ensure_datetime_serializable(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: _ensure_datetime_serializable(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_ensure_datetime_serializable(v) for v in obj]
    return obj


@app.get("/")
def root():
    return {
        "service": "Delivery Slot ML API",
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /health",
            "slots": "GET /api/slots/recommend/{uuid}",
            "docs": "GET /docs",
            "redoc": "GET /redoc",
        },
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/slots/recommend/{uuid}")
def get_slots_recommend(uuid: str):
    """
    GET /api/slots/recommend/{uuid}
    Validates UUID (unique_links), loads Order + Sender profile, runs ML, saves JSON, returns RecommendationsResponse.
    """
    if not uuid or not uuid.strip():
        return JSONResponse(
            content={"error": "UUID is required"},
            status_code=400,
        )

    try:
        db = get_db()
        unique_links = db["unique_links"]
        orders = db["orders"]
        sender_profiles = db["sender_profiles"]

        link = unique_links.find_one({"uuid": uuid.strip()})
        if not link:
            return JSONResponse(
                content={"error": "Invalid or expired link"},
                status_code=404,
            )

        if link.get("expiresAt") and link["expiresAt"] < datetime.utcnow():
            return JSONResponse(
                content={"error": "Link has expired"},
                status_code=410,
            )
        if link.get("isUsed"):
            return JSONResponse(
                content={"error": "Link has already been used"},
                status_code=410,
            )

        order_id = link.get("orderId")
        if not order_id:
            return JSONResponse(content={"error": "Order not found"}, status_code=404)
        if isinstance(order_id, str):
            order_id = ObjectId(order_id)

        order = orders.find_one({"_id": order_id})
        if not order:
            return JSONResponse(content={"error": "Order not found"}, status_code=404)

        sender_id = order.get("senderId")
        if isinstance(sender_id, str):
            sender_id = ObjectId(sender_id)
        profile = sender_profiles.find_one({"userId": sender_id}) if sender_id else None
        start_hour = profile.get("startHour") if profile else None
        end_hour = profile.get("endHour") if profile else None
        if start_hour:
            try:
                start_hour = int(str(start_hour).split(":")[0])
            except ValueError:
                start_hour = 9
        else:
            start_hour = 9

        if end_hour:
            try:
                end_hour = int(str(end_hour).split(":")[0])
            except ValueError:
                end_hour = 21
        else:
            end_hour = 21

        da = order.get("deliveryAddress")
        if has_lat_lon(da):
            delivery_lat, delivery_lon = float(da["latitude"]), float(da["longitude"])
        else:
            delivery_lat, delivery_lon = 19.076, 72.877

        pl = order.get("pickupLocation")
        store_lat = float(pl["latitude"]) if has_lat_lon(pl) else None
        store_lon = float(pl["longitude"]) if has_lat_lon(pl) else None

        parcel_category = order.get("commodityCategory") or "General"
        oid = str(order.get("_id", ""))[-8:]
        store_id = f"STR_{oid}"
        pickup_window = f"{start_hour:02d}:00-{end_hour:02d}:00"
        seller_range = f"{start_hour}-{end_hour}"

        top_n_per_day = 8
        result = recommend_delivery_slots(
            store_id=store_id,
            pickup_availability_window=pickup_window,
            seller_allowed_time_range=seller_range,
            parcel_category=parcel_category,
            delivery_location=(delivery_lat, delivery_lon),
            store_latitude=store_lat,
            store_longitude=store_lon,
            date_range_days=7,
            top_n_per_day=top_n_per_day,
        )

        if not result.get("success"):
            return JSONResponse(
                content={"error": result.get("message", "ML recommendation failed")},
                status_code=500,
            )

        # GA optimization: runs after ML, refines slot selection using success/risk and constraints
        by_date = result.get("recommendations_by_date") or {}
        flat = []
        for arr in by_date.values():
            flat.extend(arr if isinstance(arr, list) else [])

        sender_profile = {
            "startHour": start_hour,
            "endHour": end_hour,
            "failedDeliveryRate": (profile or {}).get("failedDeliveryRate"),
            "firstAttemptSuccess": order.get("firstAttemptSuccess"),
            "deliveryAttemptCount": order.get("deliveryAttemptCount") or 0,
        }
        optimized = optimize_slots(flat, sender_profile, top_n_per_day=top_n_per_day)

        if optimized:
            rec_by_date = {}
            for s in optimized:
                d = str(s.get("date", ""))
                if d not in rec_by_date:
                    rec_by_date[d] = []
                rec_by_date[d].append(s)
            result = {
                "success": True,
                "recommendations_by_date": rec_by_date,
                "message": (result.get("message") or "") + " (GA-optimized)",
            }

        out_path = Path(__file__).resolve().parent / f"recommendation_{uuid}.json"

        print(f"✅ Saving recommendation to: {out_path}")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(_ensure_datetime_serializable(result), f, indent=2, default=str)

        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(
            content={"error": str(e)},
            status_code=500,
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
