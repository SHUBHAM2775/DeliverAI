import { NextResponse } from "next/server";
import { sendDeliveryConfirmationEmail } from "@/services/emailService";

export async function POST(req: Request) {
  try {
    const { email, uuid } = (await req.json()) as {
      email?: string;
      uuid?: string;
    };

    if (!email || !uuid) {
      return NextResponse.json(
        { error: "email and uuid are required" },
        { status: 400 },
      );
    }

    const result = await sendDeliveryConfirmationEmail(email, uuid);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to send email",
          details: result.error,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", email: { sent: true } },
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

