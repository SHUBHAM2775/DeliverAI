import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import OrderModel from "@/models/Order";
import UniqueLinkModel from "@/models/UniqueLink";
import { sendEmergencyAlertEmail } from "@/services/emailService";

export async function POST(req: Request) {
  try {
    const { orderId, disruption } = await req.json();

    if (!orderId || !disruption) {
      return NextResponse.json(
        { error: "Order ID and disruption description are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch the order with receiver details
    const order = await OrderModel.findById(orderId)
      .populate("receiverId", "name email phone")
      .lean();

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const receiverEmail = (order.receiverId as any)?.email;
    const receiverName = (order.receiverId as any)?.name;

    // If no valid receiver email, silently skip but return success
    if (!receiverEmail) {
      console.warn("Skipping order without receiver email:", { orderId });
      return NextResponse.json(
        {
          success: true,
          message: "Alert processed",
          orderId,
          mailSent: false,
          reason: "no_valid_email",
        },
        { status: 200 }
      );
    }

    // Get or create unique link for this order
    let uniqueLink = await UniqueLinkModel.findOne({ orderId });

    // If no unique link exists, create one
    if (!uniqueLink) {
      const confirmationUuid = uuidv4();
      try {
        uniqueLink = await UniqueLinkModel.create({
          uuid: confirmationUuid,
          orderId,
          isUsed: false,
        });
        console.log("Created new unique link for emergency alert", {
          uuid: confirmationUuid,
          orderId,
        });
      } catch (linkError) {
        console.error("Failed to create unique link for emergency alert", {
          orderId,
          error: linkError,
        });
        return NextResponse.json(
          { error: "Failed to process this order" },
          { status: 500 }
        );
      }
    }

    // Send emergency alert email with reschedule link
    const emailResult = await sendEmergencyAlertEmail(
      receiverEmail,
      receiverName || "Valued Customer",
      uniqueLink.uuid,
      disruption
    );

    if (!emailResult.success) {
      console.error("Failed to send emergency alert email", {
        orderId,
        receiverEmail,
        error: emailResult.error,
      });

      return NextResponse.json(
        { 
          success: true,
          message: "Alert processed",
          orderId,
          mailSent: false,
          reason: "email_service_error",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Emergency alert sent to customer",
        orderId,
        mailSent: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Emergency alert API error", error);
    // Return generic success to hide internal errors
    return NextResponse.json(
      {
        success: true,
        message: "Alert processed",
        mailSent: false,
      },
      { status: 200 }
    );
  }
}
