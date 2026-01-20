
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";

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
  const query: Record<string, unknown> = {};
  if (email) query.email = email;
  if (phone) query.phone = phone;

  // If neither email nor phone provided, create a fresh receiver entry keyed by name.
  if (Object.keys(query).length === 0) {
    return (
      await UserModel.create({
        role: "RECEIVER",
        name,
        email: `receiver+${Date.now()}@example.com`,
      })
    )._id;
  }

  const update: Record<string, unknown> = {
    $setOnInsert: {
      role: "RECEIVER",
      status: "ACTIVE",
    },
  };

  if (name) {
    update.$set = { name };
  }

  const receiver = await UserModel.findOneAndUpdate(query, update, {
    upsert: true,
    new: true,
  });

  return receiver._id;
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
    });

    return NextResponse.json(
      { orderId: orderDoc._id },
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
