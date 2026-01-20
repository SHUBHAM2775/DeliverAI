/**
 * Driver Optimization Service
 * Finds the top 5 nearest available drivers for a delivery order
 * Uses Haversine distance calculation
 */

import DeliveryAgentModel from "@/models/deliveryAgent";
import { calculateHaversineDistance } from "./distanceCalculator";

interface Location {
  lat: number;
  lng: number;
}

interface DriverDistanceResult {
  driverId: string;
  status: "AVAILABLE" | "ON_ROUTE";
  totalDistance: number;
}

/**
 * Calculate distance for each driver and rank them
 * @param pickupLocation - Order pickup location {lat, lng}
 * @returns Array of top 5 nearest drivers with distances
 */
export async function findTop5NearestDrivers(
  pickupLocation: Location,
): Promise<DriverDistanceResult[]> {
  try {
    // Fetch all delivery agents with location data
    const agents = await DeliveryAgentModel.find({
      currentLocation: { $exists: true },
    }).lean();

    if (agents.length === 0) {
      console.warn("⚠️  No drivers with location data found");
      return [];
    }

    const driverDistances: DriverDistanceResult[] = [];

    for (const agent of agents) {
      if (!agent.currentLocation) {
        continue;
      }

      let totalDistance: number;

      if (agent.currentStatus === "AVAILABLE") {
        // CASE 1: AVAILABLE driver
        // Distance = driver's current location → pickup location
        totalDistance = calculateHaversineDistance(
          agent.currentLocation,
          pickupLocation,
        );
      } else if (agent.currentStatus === "ON_ROUTE") {
        // CASE 2: ON_ROUTE driver
        // Distance = driver's current location → target location → pickup location
        if (!agent.currentTargetLocation) {
          // If ON_ROUTE but no target location, skip this driver
          console.warn(
            `⚠️  Driver ${agent._id} is ON_ROUTE but has no currentTargetLocation`,
          );
          continue;
        }

        const remainingDistance = calculateHaversineDistance(
          agent.currentLocation,
          agent.currentTargetLocation,
        );

        const nextDistance = calculateHaversineDistance(
          agent.currentTargetLocation,
          pickupLocation,
        );

        totalDistance = remainingDistance + nextDistance;
      } else {
        // Unknown status, skip
        continue;
      }

      driverDistances.push({
        driverId: agent._id.toString(),
        status: agent.currentStatus,
        totalDistance: totalDistance,
      });
    }

    // Sort by distance (ascending) and take top 5
    const top5 = driverDistances
      .sort((a, b) => a.totalDistance - b.totalDistance)
      .slice(0, 5);

    return top5;
  } catch (error) {
    console.error("❌ Failed to calculate driver distances:", error);
    return [];
  }
}

/**
 * Log top 5 drivers to console in the required format
 * @param drivers - Array of driver distance results
 * @param pickupLocation - Order pickup location for context
 */
export function logTop5DriversToConsole(
  drivers: DriverDistanceResult[],
  pickupLocation: Location,
): void {
  if (drivers.length === 0) {
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚫 NO DRIVERS AVAILABLE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return;
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚚 TOP 5 NEAREST DRIVERS - OPTIMIZATION RESULTS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(
    `📍 Pickup Location: (${pickupLocation.lat.toFixed(6)}, ${pickupLocation.lng.toFixed(6)})`,
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  drivers.forEach((driver, index) => {
    const rank = index + 1;
    const distanceFormatted = driver.totalDistance.toFixed(2);

    console.log(
      `Rank ${rank} → Driver: ${driver.driverId} → Distance: ${distanceFormatted} km → Status: ${driver.status}`,
    );
  });

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}
