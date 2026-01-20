import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SlotConfirmationModel from "@/models/slotConfirmation";
import DeliveryRiskModel from "@/models/deliveryRisk";

export async function GET() {
  try {
    await connectDB();

    const confirmations = await SlotConfirmationModel.find()
      .populate("orderId")
      .populate("slotId")
      .populate("receiverId", "name email")
      .sort({ cutoffTime: -1 })
      .limit(100)
      .lean();

    const preDispatchData = await Promise.all(
      confirmations.map(async (conf: any) => {
        const risk = await DeliveryRiskModel.findOne({ orderId: conf.orderId._id }).lean();

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
          orderId: conf.orderId._id,
          receiverName: conf.receiverId.name,
          receiverEmail: conf.receiverId.email,
          slotId: conf.slotId._id,
          slotDate: conf.slotId.date,
          slotTime: conf.slotId.startTime && conf.slotId.endTime ? `${conf.slotId.startTime} - ${conf.slotId.endTime}` : "N/A",
          confirmationStatus: conf.confirmationStatus,
          confirmedAt: conf.confirmedAt || "Not confirmed yet",
          cutoffTime: conf.cutoffTime || "N/A",
          rescheduleCount: conf.rescheduleCount,
          riskLevel: risk ? risk.riskLevel : "LOW",
          riskType: risk ? risk.riskType : "NONE",
          actionSuggested,
          deliveryAddress: conf.orderId.deliveryAddress,
          area: conf.orderId.area,
          estimatedDeliveryWindow: "2 hours *",
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: preDispatchData,
      note: "Fields marked with * are static values",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching pre-dispatch data",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
