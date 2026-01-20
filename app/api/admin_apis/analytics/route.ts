import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import OrderModel from "@/models/Order";
import DeliveryFeedbackModel from "@/models/deliveryFeedback";

export async function GET() {
  try {
    await connectDB();

    const totalOrders = await OrderModel.countDocuments();
    const deliveredOrders = await OrderModel.countDocuments({ orderStatus: "DELIVERED" });
    const failedOrders = await OrderModel.countDocuments({ orderStatus: "FAILED" });

    const ordersWithFirstAttempt = await OrderModel.find({ firstAttemptSuccess: { $exists: true } }).lean();
    const firstAttemptSuccessCount = ordersWithFirstAttempt.filter((order) => order.firstAttemptSuccess === true).length;
    const firstAttemptSuccessRate = ordersWithFirstAttempt.length > 0
      ? ((firstAttemptSuccessCount / ordersWithFirstAttempt.length) * 100).toFixed(2)
      : "0";

    const feedbacks = await DeliveryFeedbackModel.find({ rating: { $exists: true } }).lean();
    const totalRatings = feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0);
    const averageRating = feedbacks.length > 0 ? (totalRatings / feedbacks.length).toFixed(2) : "N/A";

    const convenientFeedbacks = feedbacks.filter((fb) => fb.wasConvenient === true).length;
    const convenienceScore = feedbacks.length > 0 ? ((convenientFeedbacks / feedbacks.length) * 100).toFixed(2) : "N/A";

    const attemptStats = await OrderModel.aggregate([
      { $group: { _id: "$deliveryAttemptCount", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const deliveredWithDate = await OrderModel.find({
      orderStatus: "DELIVERED",
      deliveryDate: { $exists: true },
      createdAt: { $exists: true },
    }).lean();

    let avgDeliveryTimeHours = "N/A";
    if (deliveredWithDate.length > 0) {
      const totalHours = deliveredWithDate.reduce((sum, order) => {
        const diff = new Date(order.deliveryDate!).getTime() - new Date(order.createdAt!).getTime();
        return sum + diff / (1000 * 60 * 60);
      }, 0);
      avgDeliveryTimeHours = (totalHours / deliveredWithDate.length).toFixed(2);
    }

    const beforeAfterComparison = {
      beforeAI: {
        firstAttemptSuccess: "65% *",
        avgDeliveryTime: "48 hours *",
        customerSatisfaction: "3.2/5 *",
        failureRate: "25% *",
      },
      afterAI: {
        firstAttemptSuccess: `${firstAttemptSuccessRate}%`,
        avgDeliveryTime: avgDeliveryTimeHours !== "N/A" ? `${avgDeliveryTimeHours} hours` : "N/A",
        customerSatisfaction: averageRating !== "N/A" ? `${averageRating}/5` : "N/A",
        failureRate: totalOrders > 0 ? `${((failedOrders / totalOrders) * 100).toFixed(2)}%` : "N/A",
      },
      improvement: {
        successImprovement: "Data comparison shown above *",
        timeReduction: "Calculated from data *",
        satisfactionIncrease: "Based on ratings *",
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          deliveredOrders,
          failedOrders,
          pendingOrders: totalOrders - deliveredOrders - failedOrders,
          inProgressOrders: await OrderModel.countDocuments({ orderStatus: "CONFIRMED" }),
        },
        performanceMetrics: {
          firstAttemptSuccessRate: `${firstAttemptSuccessRate}%`,
          averageRating,
          convenienceScore: convenienceScore !== "N/A" ? `${convenienceScore}%` : "N/A",
          avgDeliveryTimeHours,
          deliverySuccessRate: totalOrders > 0 ? `${((deliveredOrders / totalOrders) * 100).toFixed(2)}%` : "N/A",
        },
        attemptDistribution: attemptStats,
        feedbackSummary: {
          totalFeedbacks: feedbacks.length,
          convenientDeliveries: convenientFeedbacks,
          inconvenientDeliveries: feedbacks.length - convenientFeedbacks,
          averageRating,
        },
        beforeAfterComparison,
        topFailureReasons: [
          "Receiver unavailable *",
          "Incorrect address *",
          "Weather conditions *",
        ],
        aiImpactMetrics: {
          routeOptimization: "15% improvement *",
          slotAccuracy: "82% accuracy *",
          riskPrevention: "23% reduction *",
        },
      },
      note: "Fields marked with * are static values for demonstration",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching analytics",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
