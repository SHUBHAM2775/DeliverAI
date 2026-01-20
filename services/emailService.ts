import nodemailer from "nodemailer";

function buildDeliveryConfirmationUrl(uuid: string): string {
  const baseUrl =
    process.env.DELIVERY_CONFIRM_BASE_URL ||
    "https://yourapp.com/confirm-slot";
  return `${baseUrl.replace(/\/$/, "")}/${uuid}`;
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendDeliveryConfirmationEmail(
  toEmail: string,
  confirmationUuid: string,
): Promise<{ success: boolean; error?: string }> {
  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

  if (!fromEmail) {
    const message = "SMTP_FROM_EMAIL or SMTP_USER must be configured";
    console.error(message);
    return { success: false, error: message };
  }

  if (!toEmail) {
    const message = "Recipient email is missing";
    console.error(message);
    return { success: false, error: message };
  }

  const confirmationUrl = buildDeliveryConfirmationUrl(confirmationUuid);

  const subject = "Confirm your delivery slot";
  const textBody = [
    "Your delivery is scheduled.",
    "Choose your preferred delivery time here:",
    confirmationUrl,
    "",
    "– Smart Delivery System",
  ].join("\n");

  const htmlBody = `
    <p>Your delivery is scheduled.</p>
    <p>Choose your preferred delivery time here:</p>
    <p><a href="${confirmationUrl}" target="_blank" rel="noopener noreferrer">${confirmationUrl}</a></p>
    <p>– Smart Delivery System</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log("Delivery confirmation email sent", {
      to: toEmail,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error while sending email";

    console.error("Failed to send delivery confirmation email", {
      to: toEmail,
      error: message,
    });

    return { success: false, error: message };
  }
}

