import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryFeedbackModel from "@/models/deliveryFeedback";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  try {
    const { rating, comment, wasConvenient, orderId, receiverEmail } = await req.json();

    await connectDB();

    // Resolve receiver
    const fallbackEmail = process.env.DEFAULT_RECEIVER_EMAIL || "receiver@example.com";
    let receiver = receiverEmail
      ? await UserModel.findOne({ email: receiverEmail, role: "RECEIVER" })
      : null;

    if (!receiver) {
      receiver = await UserModel.findOne({ email: fallbackEmail, role: "RECEIVER" }) || await UserModel.findOne({ role: "RECEIVER" });
    }

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    const feedbackDoc = await DeliveryFeedbackModel.create({
      receiverId: receiver._id,
      wasConvenient,
      rating,
      comment,
      submittedAt: new Date(),
      // orderId kept optional; add when UI provides it
      ...(orderId ? { orderId } : {}),
    } as any);

    return NextResponse.json({ id: feedbackDoc._id }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit feedback", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
