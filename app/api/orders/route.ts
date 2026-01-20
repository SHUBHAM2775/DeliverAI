
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import UniqueLinkModel from "@/models/UniqueLink";
import { sendDeliveryConfirmationEmail } from "@/services/emailService";
import { geocodeAddress } from "@/lib/geocodingService";
import {
  findTop5NearestDrivers,
  logTop5DriversToConsole,
} from "@/lib/driverOptimization";

type DeliverySlotInput = {
  date?: string;
  timeSlot?: string;
  startTime?: string;
  endTime?: string;
};

async function resolveSenderId() {
  // Prefer explicit sender id/email; fall back to first SENDER or create one.
  const defaultSenderId = process.env.DEFAULT_SENDER_ID;
  if (defaultSenderId) return defaultSenderId;

  const defaultSenderEmail =
    process.env.DEFAULT_SENDER_EMAIL || "sender@example.com";

  let sender =
    (await UserModel.findOne({ _id: defaultSenderId })) ||
    (await UserModel.findOne({ email: defaultSenderEmail })) ||
    (await UserModel.findOne({ role: "SENDER" }));

  if (!sender) {
    sender = await UserModel.create({
      role: "SENDER",
      name: "Default Sender",
      email: defaultSenderEmail,
      phone: "N/A",
    });
  }

  return sender._id;
}

async function upsertReceiver({
  name,
  email,
  phone,
}: {
  name: string;
  email?: string;
  phone?: string;
}) {
  // If neither email nor phone provided, create a fresh receiver entry keyed by name.
  if (!email && !phone) {
    return (
      await UserModel.create({
        role: "RECEIVER",
        name,
        email: `receiver+${Date.now()}@example.com`,
      })
    )._id;
  }

  // Try to find an existing receiver by email, then by phone
  const existingByEmail = email ? await UserModel.findOne({ email }).lean() : null;
  if (existingByEmail) return existingByEmail._id;

  const existingByPhone = phone ? await UserModel.findOne({ phone }).lean() : null;
  if (existingByPhone) return existingByPhone._id;

  // Create receiver; retry once if a duplicate key races in
  try {
    const receiver = await UserModel.create({
      role: "RECEIVER",
      status: "ACTIVE",
      name,
      email,
      phone,
    });
    return receiver._id;
  } catch (err) {
    const isDup = (err as any)?.code === 11000;
    if (isDup) {
      const fallback = email
        ? await UserModel.findOne({ email }).lean()
        : await UserModel.findOne({ phone }).lean();
      if (fallback) return fallback._id;
    }
    throw err;
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    // By default, return all orders. Pass all=false to filter by sender.
    const includeAll = searchParams.get("all") !== "false";
    const statusFilter = searchParams.get("status"); // Add status filter

    const defaultSenderEmail = process.env.DEFAULT_SENDER_EMAIL || "sender@example.com";
    let sender = await UserModel.findOne({ email: defaultSenderEmail, role: "SENDER" });

    // Fallback: if the configured sender email does not exist, use any SENDER to avoid empty dashboards.
    if (!sender) {
      sender = await UserModel.findOne({ role: "SENDER" });
    }

    if (!sender && !includeAll) {
      return NextResponse.json({ orders: [] });
    }

    // Build query with optional status filter
    const query: any = includeAll ? {} : { senderId: sender?._id };
    if (statusFilter) {
      query.orderStatus = statusFilter;
    }

    const orders = await OrderModel.find(query)
      .populate("receiverId", "name phone email")
      .populate("agentId", "name phone email") // Also populate agent details
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedOrders = orders.map((order: any) => ({
      _id: order._id.toString(), // Add _id for compatibility
      id: order._id.toString(),
      commodity: order.commodityName,
      commodityName: order.commodityName, // Add full field name
      category: order.commodityCategory || "N/A",
      customer: order.receiverId?.name || "Unknown",
      customerEmail: order.receiverId?.email,
      area: order.area,
      pincode: order.pincode,
      deliveryAddress: order.deliveryAddress, // Add delivery address
      workingHours: order.workingStartTime && order.workingEndTime
        ? `${order.workingStartTime} - ${order.workingEndTime}`
        : "N/A",
      status: order.orderStatus,
      orderStatus: order.orderStatus, // Add full field name
      description: order.description,
      quantity: order.quantity,
      isFragile: order.isFragile,
      createdAt: order.createdAt,
      pickupLat: order.geoLocation?.latitude,
      pickupLng: order.geoLocation?.longitude,
      customSlotTime: order.customSlotTime, // Add custom slot time
      deliveryDate: order.deliveryDate, // Add delivery date
      agentId: order.agentId?._id?.toString(), // Add agent ID
      agentName: order.agentId?.name, // Add agent name from populated data
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Failed to fetch orders", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      customerName,
      phone,
      email,
      pincode,
      address,
      area,
      category,
      itemName,
      description,
      quantity,
      isFragile,
      senderLat,
      senderLng,
      imageBase64,
      deliverySlots = [],
    } = await req.json();

    if (!customerName || !phone || !itemName || !category || !address || !area || !pincode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PART 1: ADDRESS GEOCODING
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Geocode delivery address

    const geocodingResult = await geocodeAddress(address);

    if (!geocodingResult.success) {
      console.error("❌ Geocoding failed:", geocodingResult.error);
      console.warn("⚠️  Order creation proceeding WITHOUT delivery location");
      console.warn("⚠️  Driver optimization will NOT be triggered");
    }

    const deliveryLocation =
      geocodingResult.success && geocodingResult.lat && geocodingResult.lng
        ? { lat: geocodingResult.lat, lng: geocodingResult.lng }
        : null;
    if (deliveryLocation) {
      console.log(
        `📦 Delivery geocoded → (${deliveryLocation.lat}, ${deliveryLocation.lng})`,
      );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PART 2: PICKUP LOCATION (Sender's location)
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const pickupLocation =
      senderLat && senderLng
        ? {
            lat: Number(senderLat),
            lng: Number(senderLng),
          }
        : undefined;

    if (!pickupLocation) {
      console.warn("⚠️  No pickup location provided");
    } else {
      console.log(
        `📍 Pickup → (${pickupLocation.lat}, ${pickupLocation.lng})`,
      );
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PART 3: CREATE ORDER WITH RESOLVED COORDINATES
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    const [senderId, receiverId] = await Promise.all([
      resolveSenderId(),
      upsertReceiver({ name: customerName, email, phone }),
    ]);

    const parsedSlots: DeliverySlotInput[] = Array.isArray(deliverySlots)
      ? deliverySlots.map((s) => ({
          date: s?.date?.trim?.() || undefined,
          timeSlot: s?.timeSlot?.trim?.() || undefined,
          startTime: s?.startTime?.trim?.() || undefined,
          endTime: s?.endTime?.trim?.() || undefined,
        }))
      : [];

    const firstSlot = parsedSlots.find(
      (s) => s.date || s.startTime || s.timeSlot || s.endTime,
    );

    const workingStartTime = firstSlot?.startTime;
    const workingEndTime = firstSlot?.endTime;

    const confirmationUuid = uuidv4();

    // Create order payload
    
    const orderPayload = {
      senderId,
      receiverId,
      commodityName: itemName,
      commodityCategory: category,
      description,
      quantity,
      isFragile: Boolean(isFragile),
      imageUrl: imageBase64,
      deliveryAddress: address,
      area,
      pincode,
      workingStartTime,
      workingEndTime,
      pickupLocation: pickupLocation,
      deliveryDate: firstSlot?.date ? new Date(firstSlot.date) : undefined,
      orderStatus: "CREATED",
      deliveryAttemptCount: 0,
      firstAttemptSuccess: undefined,
      confirmationUuid,
      receiverPhone: phone,
      deliveryLocation: deliveryLocation, // NEW: Customer address geocoded to lat/long
    };
    
    const orderDoc = await OrderModel.create(orderPayload);
    console.log(
      `✅ Order created ${orderDoc._id} — addr: ${orderDoc.deliveryAddress}`,
    );

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // PART 4: DRIVER DISTANCE OPTIMIZATION
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if (pickupLocation) {
      await findTop5NearestDrivers(pickupLocation);
    } else {
      console.warn("\n⚠️  Driver optimization SKIPPED (no pickup location available)");
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // CREATE UNIQUE LINK & SEND EMAIL
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    // Create unique link entry immediately after order creation
    try {
      await UniqueLinkModel.create({
        uuid: confirmationUuid,
        orderId: orderDoc._id,
        isUsed: false,
      });
      console.log("🔗 Unique link created");
    } catch (linkError) {
      console.error("Failed to create unique link", {
        uuid: confirmationUuid,
        orderId: orderDoc._id,
        error: linkError,
      });
      // Continue even if unique link creation fails, but log it
    }

    let emailStatus: { sent: boolean; error?: string } = { sent: false };

    // Email sending; the order is created even if email fails.
    if (email) {
      const orderDetails = {
        commodityName: itemName,
        commodityCategory: category,
        description,
        quantity,
        isFragile: Boolean(isFragile),
        deliveryAddress: address,
        area,
        pincode,
        customerName,
      };
      const emailResult = await sendDeliveryConfirmationEmail(
        email,
        confirmationUuid,
        orderDetails,
      );
      emailStatus = {
        sent: emailResult.success,
        error: emailResult.error,
      };

      if (!emailResult.success) {
        console.error("Failed to send delivery confirmation email", {
          orderId: orderDoc._id,
          error: emailResult.error,
        });
      }
    } else {
      emailStatus = { sent: false, error: "No email address provided" };
      console.warn("No email provided; delivery confirmation email not sent", {
        orderId: orderDoc._id,
      });
    }

    return NextResponse.json(
      { orderId: orderDoc._id, confirmationUuid, email: emailStatus },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation failed", error);
    const message =
      error instanceof Error ? error.message : "Unknown error while creating order";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
