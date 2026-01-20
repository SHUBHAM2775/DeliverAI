/**
 * Distance Calculator using Haversine Formula
 * Calculates distance between two geographic points on Earth
 * Distance is returned in KILOMETERS
 */

interface Location {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * @param point1 - First location {lat, lng}
 * @param point2 - Second location {lat, lng}
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  point1: Location,
  point2: Location,
): number {
  const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers

  // Convert degrees to radians
  const lat1Rad = toRadians(point1.lat);
  const lat2Rad = toRadians(point2.lat);
  const deltaLatRad = toRadians(point2.lat - point1.lat);
  const deltaLngRad = toRadians(point2.lng - point1.lng);

  // Haversine formula
  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLngRad / 2) *
      Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;

  return distance;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total distance for a route with multiple waypoints
 * @param waypoints - Array of locations in order of travel
 * @returns Total distance in kilometers
 */
export function calculateRouteDistance(waypoints: Location[]): number {
  if (waypoints.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateHaversineDistance(waypoints[i], waypoints[i + 1]);
  }

  return totalDistance;
}
