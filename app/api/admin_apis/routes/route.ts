import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import RouteModel from "@/models/route";
import DeliveryAgentModel from "@/models/deliveryAgent";

export async function GET() {
  try {
    await connectDB();

    const routes = await RouteModel.find()
      .populate("agentId", "name email")
      .populate("orders")
      .sort({ date: -1 })
      .limit(50)
      .lean();

    const routeData = await Promise.all(
      routes.map(async (route: any) => {
        const agent = await DeliveryAgentModel.findOne({ userId: route.agentId._id }).lean();

        return {
          routeId: route._id,
          agentId: route.agentId._id,
          agentName: route.agentId.name,
          routeDate: route.date,
          totalOrders: route.orders ? route.orders.length : 0,
          routeDistance: route.routeDistance ? `${route.routeDistance} km` : "N/A",
          routeDuration: route.routeDuration ? `${route.routeDuration} mins` : "N/A",
          routeFeasibilityScore: route.routeFeasibilityScore || "N/A",
          conflicts: route.conflicts && route.conflicts.length > 0 ? route.conflicts : ["No conflicts detected *"],
          agentStatus: agent ? agent.currentStatus : "AVAILABLE",
          estimatedCompletionTime: route.estimatedTime || "N/A",
          trafficImpact: "Low *",
          weatherRisk: "None *",
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: routeData,
      note: "Fields marked with * are static values",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching routes",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
