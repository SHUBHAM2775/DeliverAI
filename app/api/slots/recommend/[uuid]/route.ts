import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UniqueLinkModel from "@/models/UniqueLink";
import OrderModel from "@/models/Order";
import SenderProfileModel from "@/models/senderProfile";

const FASTAPI_ML_URL = process.env.FASTAPI_ML_URL || "http://127.0.0.1:8000";

function hasLatLon(obj: unknown): obj is { latitude: number; longitude: number } {
  return (
    obj != null &&
    typeof obj === "object" &&
    "latitude" in obj &&
    "longitude" in obj &&
    Number.isFinite(Number((obj as any).latitude)) &&
    Number.isFinite(Number((obj as any).longitude))
  );
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ uuid: string }> | { uuid: string } }
) {
  try {
    const { uuid } = context.params instanceof Promise ? await context.params : context.params;
    if (!uuid || typeof uuid !== "string") {
      return NextResponse.json({ error: "UUID is required" }, { status: 400 });
    }

    await connectDB();

    const uniqueLink = await UniqueLinkModel.findOne({ uuid }).lean();
    if (!uniqueLink) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 404 });
    }
    if (uniqueLink.expiresAt && new Date(uniqueLink.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Link has expired" }, { status: 410 });
    }
    if (uniqueLink.isUsed) {
      return NextResponse.json({ error: "Link has already been used" }, { status: 410 });
    }

    const order = await OrderModel.findById(uniqueLink.orderId).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const senderProfile = await SenderProfileModel.findOne({ userId: order.senderId }).lean();
    const startHour = senderProfile?.startHour ?? 9;
    const endHour = senderProfile?.endHour ?? 21;

    // Delivery location: require {latitude, longitude}
    const da = (order as any).deliveryAddress;
    const deliveryLat = hasLatLon(da) ? (da.latitude as number) : 19.076;
    const deliveryLon = hasLatLon(da) ? (da.longitude as number) : 72.877;

    const pl = (order as any).pickupLocation;
    const storeLat = hasLatLon(pl) ? (pl.latitude as number) : null;
    const storeLon = hasLatLon(pl) ? (pl.longitude as number) : null;

    const parcelCategory = (order as any).commodityCategory || "General";
    const storeId = `STR_${String((order as any)._id).slice(-8)}`;
    const pickupWindow = `${String(startHour).padStart(2, "0")}:00-${String(endHour).padStart(2, "0")}:00`;
    const sellerRange = `${startHour}-${endHour}`;

    const body = {
      uuid,
      store_id: storeId,
      pickup_availability_window: pickupWindow,
      seller_allowed_time_range: sellerRange,
      parcel_category: parcelCategory,
      delivery_lat: deliveryLat,
      delivery_lon: deliveryLon,
      store_lat: storeLat,
      store_lon: storeLon,
      top_n_per_day: 8,
      date_range_days: 7,
    };

    const res = await fetch(`${FASTAPI_ML_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.detail || data?.message || "ML service error" },
        { status: res.status >= 400 ? res.status : 500 }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("slots/recommend error", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
