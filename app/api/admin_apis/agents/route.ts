import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryAgentModel from "@/models/deliveryAgent";
import "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const agents = await DeliveryAgentModel.find().populate("userId", "name phone status").lean();

    const agentData = agents.map((agent: any) => {
      const user = agent.userId || {};

      return {
        agentId: agent._id,
        userId: user._id || "N/A",
        name: user.name || "N/A",
        phone: user.phone || "N/A",
        age: agent.age ?? "N/A",
        rating: typeof agent.rating === "number" ? agent.rating.toFixed(1) : "N/A",
        successRate: typeof agent.successRate === "number" ? `${(agent.successRate * 100).toFixed(1)}%` : "N/A",
        avgDelayMinutes: typeof agent.avgDelayMinutes === "number" ? `${agent.avgDelayMinutes} mins` : "N/A",
        preferredAreas:
          Array.isArray(agent.preferredAreas) && agent.preferredAreas.length > 0
            ? agent.preferredAreas
            : ["Not specified"],
        currentStatus: agent.currentStatus || "UNKNOWN",
        totalDeliveries: agent.totalDeliveries ?? 0,
        accountStatus: user.status || "UNKNOWN",
        bestAreaSuggestion: "Downtown Area (Based on historical data) *",
        performanceTrend: "Improving *",
      };
    });

    return NextResponse.json({
      success: true,
      data: agentData,
      note: "Fields marked with * are static values",
    });
  } catch (error: any) {
    console.error("/api/admin_apis/agents error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching agents",
        error: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
