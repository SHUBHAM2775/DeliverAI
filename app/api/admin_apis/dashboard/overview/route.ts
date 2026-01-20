import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OrderModel from "@/models/Order";
import DeliveryRiskModel from "@/models/deliveryRisk";
import DeliveryAgentModel from "@/models/deliveryAgent";
import SlotConfirmationModel from "@/models/slotConfirmation";
import SlotPredictionModel from "@/models/slotPrediction";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalOrdersToday = await OrderModel.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const ordersWithAttempts = await OrderModel.find({
      createdAt: { $gte: today, $lt: tomorrow },
      firstAttemptSuccess: { $exists: true },
    });
    const firstAttemptSuccessCount = ordersWithAttempts.filter(
      (order) => order.firstAttemptSuccess === true,
    ).length;
    const firstAttemptSuccessPercentage = ordersWithAttempts.length > 0
      ? ((firstAttemptSuccessCount / ordersWithAttempts.length) * 100).toFixed(2)
      : "0";

    const failedDeliveriesToday = await OrderModel.countDocuments({
      orderStatus: "FAILED",
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const highRiskDeliveriesCount = await DeliveryRiskModel.countDocuments({
      riskLevel: "HIGH",
    });

    const activeAgents = await DeliveryAgentModel.countDocuments({ currentStatus: "AVAILABLE" });

    const pendingConfirmations = await SlotConfirmationModel.countDocuments({ confirmationStatus: "PENDING" });

    const predictions = await SlotPredictionModel.find({ predictedSuccessProbability: { $ne: null } }).lean();
    const aiPredictionAccuracy = predictions.length
      ? `${((predictions.reduce((sum, p: any) => sum + (p.predictedSuccessProbability || 0), 0) / predictions.length) * 100).toFixed(1)}%`
      : "96.8% *";

    const avgDeliveryDelay = "12 minutes *";
    const activeDeliveryZones = [
      "Zone A - Downtown *",
      "Zone B - Suburbs *",
      "Zone C - Industrial *",
      "Zone D - Residential *",
    ];

    return NextResponse.json({
      success: true,
      data: {
        totalOrdersToday,
        firstAttemptSuccessPercentage: `${firstAttemptSuccessPercentage}%`,
        failedDeliveriesToday,
        avgDeliveryDelay,
        highRiskDeliveriesCount,
        activeDeliveryZones,
        activeAgents,
        pendingConfirmations,
        aiPredictionAccuracy,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching dashboard overview",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
