import { NextResponse } from "next/server";
import { sendDeliveryConfirmationEmail } from "@/services/emailService";
import connectDB from "@/lib/db";
import UniqueLinkModel from "@/models/UniqueLink";
import OrderModel from "@/models/Order";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, uuid, orderId, receiverEmail } = body as {
      email?: string;
      uuid?: string;
      orderId?: string;
      receiverEmail?: string;
    };

    await connectDB();

    let finalEmail: string;
    let finalUuid: string;

    // Handle two formats:
    // 1. Old format: { email, uuid }
    // 2. New format: { orderId, receiverEmail }
    if (email && uuid) {
      // Old format - use as is
      finalEmail = email;
      finalUuid = uuid;
    } else if (orderId && receiverEmail) {
      // New format - need to generate/fetch UUID
      finalEmail = receiverEmail;

      // Check if a unique link already exists for this order
      let existingLink = await UniqueLinkModel.findOne({ orderId });

      if (existingLink) {
        // Reuse existing UUID
        finalUuid = existingLink.uuid;

        // Mark as not used so receiver can use it again
        await UniqueLinkModel.updateOne(
          { orderId },
          { isUsed: false }
        );
      } else {
        // Create a new unique link
        const newLink = await UniqueLinkModel.create({
          orderId,
          uuid: crypto.randomUUID(),
          isUsed: false,
        });
        finalUuid = newLink.uuid;
      }
    } else {
      return NextResponse.json(
        { error: "Either (email and uuid) or (orderId and receiverEmail) are required" },
        { status: 400 },
      );
    }

    const result = await sendDeliveryConfirmationEmail(finalEmail, finalUuid);

    console.log('📧 Send link attempt:', {
      email: finalEmail,
      uuid: finalUuid,
      success: result.success,
      error: result.error,
    });

    const rescheduleLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/receiver_page/slot-selection/${finalUuid}`;

    if (!result.success) {
      console.warn('⚠️ Email failed, but returning link for manual use');
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: result.error,
          rescheduleLink, // Include link even on email failure
        },
        { status: 200 }, // Changed to 200 so UI can still show the link
      );
    }

    return NextResponse.json(
      {
        message: "Email sent successfully",
        email: { sent: true },
        rescheduleLink, // Include link in success response too
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while sending email";

    console.error("Manual send-link API failed", { error: message });

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}


