/**
 * API Endpoint: Update Driver Location
 * 
 * Allows drivers to update their current location
 * This would typically be called from a mobile app with GPS data
 * 
 * POST /api/drivers/location
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import DeliveryAgentModel from "@/models/deliveryAgent";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId, lat, lng, status, targetLat, targetLng } = await req.json();

    if (!userId || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: userId, lat, lng" },
        { status: 400 },
      );
    }

    // Validate coordinates
    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return NextResponse.json(
        { error: "Invalid coordinates. Lat must be [-90, 90], Lng must be [-180, 180]" },
        { status: 400 },
      );
    }

    await connectDB();

    // Verify user exists and is a driver
    const user = await UserModel.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "DRIVER") {
      return NextResponse.json(
        { error: "User is not a driver" },
        { status: 403 },
      );
    }

    // Find or create delivery agent record
    let agent = await DeliveryAgentModel.findOne({ userId });

    if (!agent) {
      // Create new agent if doesn't exist
      agent = await DeliveryAgentModel.create({
        userId,
        currentLocation: { lat, lng },
        currentStatus: status || "AVAILABLE",
        totalDeliveries: 0,
      });

      console.log(`✅ Created new delivery agent for user ${userId}`);
    } else {
      // Update existing agent
      const updateData: any = {
        currentLocation: { lat, lng },
      };

      // Update status if provided
      if (status && ["AVAILABLE", "ON_ROUTE"].includes(status)) {
        updateData.currentStatus = status;
      }

      // Update target location if provided and status is ON_ROUTE
      if (
        status === "ON_ROUTE" &&
        targetLat !== undefined &&
        targetLng !== undefined
      ) {
        if (
          typeof targetLat !== "number" ||
          typeof targetLng !== "number" ||
          targetLat < -90 ||
          targetLat > 90 ||
          targetLng < -180 ||
          targetLng > 180
        ) {
          return NextResponse.json(
            { error: "Invalid target coordinates" },
            { status: 400 },
          );
        }

        updateData.currentTargetLocation = {
          lat: targetLat,
          lng: targetLng,
        };
      }

      // Clear target location if status is AVAILABLE
      if (status === "AVAILABLE") {
        updateData.currentTargetLocation = undefined;
      }

      agent = await DeliveryAgentModel.findOneAndUpdate(
        { userId },
        updateData,
        { new: true },
      );

      console.log(`✅ Updated location for driver ${userId}`);
      console.log(
        `   Location: (${lat}, ${lng}) | Status: ${agent?.currentStatus}`,
      );
    }

    return NextResponse.json(
      {
        success: true,
        agentId: agent?._id,
        currentLocation: agent?.currentLocation,
        currentStatus: agent?.currentStatus,
        currentTargetLocation: agent?.currentTargetLocation,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update driver location:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error while updating location";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * GET /api/drivers/location?userId=XXX
 * Get current location of a specific driver
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter required" },
        { status: 400 },
      );
    }

    await connectDB();

    const agent = await DeliveryAgentModel.findOne({ userId }).populate(
      "userId",
      "name email",
    );

    if (!agent) {
      return NextResponse.json(
        { error: "Delivery agent not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        agentId: agent._id,
        driver: agent.userId,
        currentLocation: agent.currentLocation,
        currentStatus: agent.currentStatus,
        currentTargetLocation: agent.currentTargetLocation,
        stats: {
          totalDeliveries: agent.totalDeliveries,
          rating: agent.rating,
          successRate: agent.successRate,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch driver location:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error while fetching location";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
