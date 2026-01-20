import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import UserModel from "@/models/User";
import SenderProfileModel from "@/models/senderProfile";

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

    const profile = await SenderProfileModel.findOne({ userId: sender._id });
    if (!profile) {
      return NextResponse.json({ error: "Sender profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      organizationName: profile.organizationName || sender.name,
      phone: sender.phone,
      email: sender.email,
      startHour: profile.startHour,
      endHour: profile.endHour,
      defaultPickupAddress: profile.defaultPickupAddress,
    });
  } catch (error) {
    console.error("Failed to fetch sender profile", error);
    return NextResponse.json({ error: "Failed to fetch sender profile" }, { status: 500 });
  }
}
