import nodemailer from "nodemailer";

function buildDeliveryConfirmationUrl(uuid: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.DELIVERY_CONFIRM_BASE_URL ||
    "http://localhost:3000";
  return `${baseUrl.replace(/\/$/, "")}/receiver_page/slot-selection/${uuid}`;
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OrderDetails {
  commodityName: string;
  commodityCategory?: string;
  description?: string;
  quantity?: string;
  isFragile?: boolean;
  deliveryAddress: string;
  area: string;
  pincode: string;
  customerName?: string;
}

export async function sendDeliveryConfirmationEmail(
  toEmail: string,
  confirmationUuid: string,
  orderDetails?: OrderDetails,
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

  const subject = orderDetails
    ? `Delivery Confirmation - ${orderDetails.commodityName}`
    : "Confirm your delivery slot";

  // Build text body with order details
  const textLines = [
    "Hello!",
    "",
    orderDetails
      ? "Your delivery order has been created. Here are the details:"
      : "Your delivery is scheduled.",
  ];

  if (orderDetails) {
    textLines.push("");
    textLines.push("Order Details:");
    textLines.push(`- Item: ${orderDetails.commodityName}`);
    if (orderDetails.commodityCategory) {
      textLines.push(`- Category: ${orderDetails.commodityCategory}`);
    }
    if (orderDetails.description) {
      textLines.push(`- Description: ${orderDetails.description}`);
    }
    if (orderDetails.quantity) {
      textLines.push(`- Quantity: ${orderDetails.quantity}`);
    }
    if (orderDetails.isFragile) {
      textLines.push("- Fragile: Yes");
    }
    textLines.push(
      `- Delivery Address: ${orderDetails.deliveryAddress}, ${orderDetails.area} - ${orderDetails.pincode}`,
    );
    textLines.push("");
  }

  textLines.push(
    "Please click on the link below to select your preferred delivery slot:",
  );
  textLines.push(confirmationUrl);
  textLines.push("");
  textLines.push("– DeliverAI");

  const textBody = textLines.join("\n");

  // Build HTML body with order details
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333;">Hello!</h2>
      <p>${orderDetails ? "Your delivery order has been created. Here are the details:" : "Your delivery is scheduled."}</p>
      ${
        orderDetails
          ? `
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Order Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 5px 0;"><strong>Item:</strong> ${orderDetails.commodityName}</li>
            ${orderDetails.commodityCategory ? `<li style="padding: 5px 0;"><strong>Category:</strong> ${orderDetails.commodityCategory}</li>` : ""}
            ${orderDetails.description ? `<li style="padding: 5px 0;"><strong>Description:</strong> ${orderDetails.description}</li>` : ""}
            ${orderDetails.quantity ? `<li style="padding: 5px 0;"><strong>Quantity:</strong> ${orderDetails.quantity}</li>` : ""}
            ${orderDetails.isFragile ? `<li style="padding: 5px 0;"><strong>Fragile:</strong> Yes</li>` : ""}
            <li style="padding: 5px 0;"><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}, ${orderDetails.area} - ${orderDetails.pincode}</li>
          </ul>
        </div>
      `
          : ""
      }
      <p>Please click on the link below to select your preferred delivery slot:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmationUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Select Delivery Slot
        </a>
      </div>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">– DeliverAI</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`📧 Delivery confirmation email sent to ${toEmail}`);

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error while sending email";

    console.error("Failed to send delivery confirmation email", {
      to: toEmail,
      error: message,
    });

    return { success: false, error: message };
  }
}

export async function sendEmergencyAlertEmail(
  toEmail: string,
  customerName: string,
  confirmationUuid: string,
  disruption: string,
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

  const rescheduleUrl = buildDeliveryConfirmationUrl(confirmationUuid);

  const subject = "🚨 Delivery Disruption Alert - Reschedule Your Slots";

  const textLines = [
    `Hello ${customerName || "Valued Customer"},`,
    "",
    "⚠️  URGENT: Your scheduled delivery has encountered a disruption.",
    "",
    "Reason:",
    disruption,
    "",
    "What you need to do:",
    "Please click the link below to reschedule your delivery slots at your earliest convenience.",
    "",
    rescheduleUrl,
    "",
    "We apologize for the inconvenience and appreciate your understanding.",
    "– DeliverAI",
  ];

  const textBody = textLines.join("\n");

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <h2 style="color: #991b1b; margin-top: 0;">🚨 Delivery Disruption Alert</h2>
        <p style="color: #7f1d1d; margin: 0;">Your scheduled delivery has encountered a disruption and requires rescheduling.</p>
      </div>

      <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #92400e;">Reason for Disruption:</h3>
        <p style="color: #78350f; margin: 0; line-height: 1.6;">${disruption}</p>
      </div>

      <p style="color: #1f2937; font-size: 16px; margin: 20px 0;">
        <strong>What you need to do:</strong><br/>
        Please reschedule your delivery slots at your earliest convenience by clicking the button below.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${rescheduleUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #dc2626; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
          Reschedule Delivery Slots
        </a>
      </div>

      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="color: #1e40af; margin: 0; font-size: 14px;">
          <strong>Note:</strong> Once you reschedule, we will process your new delivery at the earliest possible time. Thank you for your patience!
        </p>
      </div>

      <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">– DeliverAI</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`📧 Emergency alert email sent to ${toEmail}`);

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error while sending email";

    console.error("Failed to send emergency alert email", {
      to: toEmail,
      error: message,
    });

    return { success: false, error: message };
  }
}
