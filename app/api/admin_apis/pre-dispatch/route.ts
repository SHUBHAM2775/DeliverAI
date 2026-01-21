import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SlotConfirmationModel from "@/models/slotConfirmation";
import DeliveryRiskModel from "@/models/deliveryRisk";
import OrderModel from "@/models/Order";
import UserModel from "@/models/User";
import DeliverySlotModel from "@/models/DeliverySlot";

export async function GET() {
  try {
    console.log("Starting pre-dispatch data fetch...");
    await connectDB();
    console.log("Database connected");

    // Get all slot confirmations without populate first
    const confirmations = await SlotConfirmationModel.find()
      .sort({ cutoffTime: -1 })
      .limit(100)
      .lean();

    console.log(`Found ${confirmations.length} slot confirmations`);

    const preDispatchData = await Promise.all(
      confirmations.map(async (conf: any) => {
        try {
          // Manually fetch related documents
          const order = await OrderModel.findById(conf.orderId).lean();
          const receiver = await UserModel.findById(conf.receiverId, "name email").lean();
          const slot = await DeliverySlotModel.findById(conf.slotId).lean();
          
          // Validate required fields
          if (!order || !receiver) {
            console.warn("Skipping confirmation with missing order or receiver:", conf._id);
            return null;
          }

          const risk = await DeliveryRiskModel.findOne({ orderId: conf.orderId }).lean();

          let actionSuggested = "";
          if (risk && risk.actionSuggested) {
            actionSuggested = risk.actionSuggested;
          } else if (conf.confirmationStatus === "PENDING") {
            actionSuggested = "Send reminder to receiver *";
          } else {
            actionSuggested = "Proceed with delivery *";
          }

          return {
            confirmationId: conf._id,
            orderId: conf.orderId,
            receiverName: receiver.name || "Unknown",
            receiverEmail: receiver.email || "N/A",
            slotId: conf.slotId ? String(conf.slotId) : "N/A",
            slotDate: slot ? slot.date : "N/A",
            slotTime: slot && slot.startTime && slot.endTime ? `${slot.startTime} - ${slot.endTime}` : "N/A",
            confirmationStatus: conf.confirmationStatus || "UNKNOWN",
            confirmedAt: conf.confirmedAt || "Not confirmed yet",
            cutoffTime: conf.cutoffTime || "N/A",
            rescheduleCount: conf.rescheduleCount || 0,
            riskLevel: risk ? risk.riskLevel : "LOW",
            riskType: risk ? risk.riskType : "NONE",
            actionSuggested,
            deliveryAddress: order.deliveryAddress || "N/A",
            area: order.area || "N/A",
            estimatedDeliveryWindow: "2 hours *",
          };
        } catch (itemError: any) {
          console.error("Error processing confirmation item:", conf._id, itemError.message);
          return null;
        }
      }),
    );

    // Filter out null values from validation failures
    const filteredData = preDispatchData.filter((item) => item !== null);
    console.log(`Returning ${filteredData.length} processed items`);

    return NextResponse.json({
      success: true,
      data: filteredData,
      note: "Fields marked with * are static values",
    });
  } catch (error: any) {
    console.error("Error in pre-dispatch API:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching pre-dispatch data",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
