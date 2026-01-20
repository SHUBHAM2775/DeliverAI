"""
FastAPI server for Delivery Slot ML Recommendations.
Accepts order + sender profile data from Next.js, runs ML model, saves to JSON, returns result.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import from local api module
from api import recommend_delivery_slots

app = FastAPI(title="Delivery Slot ML API", version="1.0.0")

# CORS so Next.js can call during dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RecommendRequest(BaseModel):
    uuid: str
    store_id: str
    pickup_availability_window: str  # e.g. "09:00-21:00"
    seller_allowed_time_range: str   # e.g. "10-21"
    parcel_category: str
    delivery_lat: float
    delivery_lon: float
    store_lat: Optional[float] = None
    store_lon: Optional[float] = None
    top_n_per_day: int = 8
    date_range_days: int = 7


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
            "recommend": "POST /recommend",
            "docs": "GET /docs",
            "redoc": "GET /redoc",
        },
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recommend")
def recommend_slots(req: RecommendRequest):
    """
    Run ML model for slot recommendations.
    Saves result to recommendation_{uuid}.json and returns it.
    """
    try:
        result = recommend_delivery_slots(
            store_id=req.store_id,
            pickup_availability_window=req.pickup_availability_window,
            seller_allowed_time_range=req.seller_allowed_time_range,
            parcel_category=req.parcel_category,
            delivery_location=(req.delivery_lat, req.delivery_lon),
            store_latitude=req.store_lat,
            store_longitude=req.store_lon,
            date_range_days=req.date_range_days,
            top_n_per_day=req.top_n_per_day,
        )

        # Save to local JSON (in python folder)
        script_dir = Path(__file__).resolve().parent
        out_path = script_dir / f"recommendation_{req.uuid}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(_ensure_datetime_serializable(result), f, indent=2, default=str)
        # Ensure default=str handles any remaining datetime

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
