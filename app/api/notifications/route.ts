import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/User";
import NotificationModel from "@/models/notification";

export async function GET() {
  try {
    await connectDB();

    const senderEmail = process.env.DEFAULT_SENDER_EMAIL || "sender@example.com";
    let sender = await UserModel.findOne({ email: senderEmail, role: "SENDER" });

    if (!sender) {
      sender = await UserModel.findOne({ role: "SENDER" });
    }

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    const notifications = await NotificationModel.find({ userId: sender._id })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = notifications.map((n) => ({
      id: n._id.toString(),
      type: n.type || "REMINDER",
      message: n.message,
      orderId: n.orderId ? n.orderId.toString() : undefined,
      isRead: n.isRead ?? false,
      createdAt: n.createdAt ? n.createdAt.toISOString() : undefined,
    }));

    return NextResponse.json({ notifications: formatted });
  } catch (error) {
    console.error("Failed to fetch notifications", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}
