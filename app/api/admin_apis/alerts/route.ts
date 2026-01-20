import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryRiskModel from "@/models/deliveryRisk";

export async function GET() {
  try {
    await connectDB();

    const risks = await DeliveryRiskModel.find()
      .populate("orderId", "commodityName deliveryAddress area")
      .populate("slotId", "date startTime endTime")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const alertData = risks.map((risk: any) => ({
      riskId: risk._id,
      orderId: risk.orderId._id,
      commodityName: risk.orderId.commodityName,
      deliveryAddress: risk.orderId.deliveryAddress,
      area: risk.orderId.area,
      slotInfo: risk.slotId
        ? { date: risk.slotId.date, time: `${risk.slotId.startTime} - ${risk.slotId.endTime}` }
        : "No slot assigned",
      riskType: risk.riskType || "UNKNOWN",
      riskLevel: risk.riskLevel || "MEDIUM",
      description: risk.description || "No description provided",
      actionSuggested: risk.actionSuggested || "Review and take appropriate action *",
      createdAt: risk.createdAt,
      dataSource:
        risk.riskType === "TRAFFIC"
          ? "Traffic API *"
          : risk.riskType === "WEATHER"
            ? "Weather Service *"
            : "System Analysis *",
      severity: "Monitor *",
      estimatedImpact: "Medium *",
    }));

    const summary = {
      high: alertData.filter((a) => a.riskLevel === "HIGH").length,
      medium: alertData.filter((a) => a.riskLevel === "MEDIUM").length,
      low: alertData.filter((a) => a.riskLevel === "LOW").length,
    };

    return NextResponse.json({
      success: true,
      summary,
      data: alertData,
      note: "Fields marked with * are static values",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching alerts",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
