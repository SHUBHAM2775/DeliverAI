
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import UniqueLinkModel from "@/models/UniqueLink";
import { sendDeliveryConfirmationEmail } from "@/services/emailService";

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

    const defaultSenderEmail = process.env.DEFAULT_SENDER_EMAIL || "sender@example.com";
    let sender = await UserModel.findOne({ email: defaultSenderEmail, role: "SENDER" });

    // Fallback: if the configured sender email does not exist, use any SENDER to avoid empty dashboards.
    if (!sender) {
      sender = await UserModel.findOne({ role: "SENDER" });
    }

    if (!sender && !includeAll) {
      return NextResponse.json({ orders: [] });
    }

    const query = includeAll ? {} : { senderId: sender?._id };

    const orders = await OrderModel.find(query)
      .populate("receiverId", "name phone email")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const formattedOrders = orders.map((order: any) => ({
      id: order._id.toString(),
      commodity: order.commodityName,
      category: order.commodityCategory || "N/A",
      customer: order.receiverId?.name || "Unknown",
      customerEmail: order.receiverId?.email,
      area: order.area,
      pincode: order.pincode,
      workingHours: order.workingStartTime && order.workingEndTime
        ? `${order.workingStartTime} - ${order.workingEndTime}`
        : "N/A",
      status: order.orderStatus,
      description: order.description,
      quantity: order.quantity,
      isFragile: order.isFragile,
      createdAt: order.createdAt,
      pickupLat: order.geoLocation?.latitude,
      pickupLng: order.geoLocation?.longitude,
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
      pickupLat,
      pickupLng,
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

    const orderDoc = await OrderModel.create({
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
      geoLocation:
        pickupLat && pickupLng
          ? {
              latitude: Number(pickupLat),
              longitude: Number(pickupLng),
            }
          : undefined,
      deliveryDate: firstSlot?.date ? new Date(firstSlot.date) : undefined,
      orderStatus: "CREATED",
      deliveryAttemptCount: 0,
      firstAttemptSuccess: undefined,
      confirmationUuid,
      receiverPhone: phone,
    });

    // Create unique link entry immediately after order creation
    try {
      await UniqueLinkModel.create({
        uuid: confirmationUuid,
        orderId: orderDoc._id,
        isUsed: false,
      });
      console.log("Unique link created", {
        uuid: confirmationUuid,
        orderId: orderDoc._id,
      });
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
