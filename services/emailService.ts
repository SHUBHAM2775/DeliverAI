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
    orderDetails ? "Your delivery order has been created. Here are the details:" : "Your delivery is scheduled.",
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
    textLines.push(`- Delivery Address: ${orderDetails.deliveryAddress}, ${orderDetails.area} - ${orderDetails.pincode}`);
    textLines.push("");
  }

  textLines.push("Please click on the link below to select your preferred delivery slot:");
  textLines.push(confirmationUrl);
  textLines.push("");
  textLines.push("– Smart Delivery System");

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
      <p style="color: #666; font-size: 12px; margin-top: 30px;">– Smart Delivery System</p>
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

