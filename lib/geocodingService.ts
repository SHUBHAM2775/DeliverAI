/**
 * Geocoding Service
 * Converts address strings to latitude and longitude coordinates
 * Uses Nominatim (OpenStreetMap) API - FREE service with no API key required
 */

interface GeocodingResult {
  success: boolean;
  lat?: number;
  lng?: number;
  error?: string;
}

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

/**
 * Convert an address string to latitude and longitude
 * @param address - Full delivery address as string
 * @returns GeocodingResult with coordinates or error
 */
export async function geocodeAddress(
  address: string,
): Promise<GeocodingResult> {
  if (!address || address.trim().length === 0) {
    return {
      success: false,
      error: "Address cannot be empty",
    };
  }

  try {
    // Nominatim requires a user agent
    const params = new URLSearchParams({
      q: address.trim(),
      format: "json",
      limit: "1",
      addressdetails: "1",
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": "DeliveryOptimizationPlatform/1.0",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Geocoding API returned status ${response.status}`,
      };
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return {
        success: false,
        error: "Address not found - could not geocode",
      };
    }

    const result = data[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (isNaN(lat) || isNaN(lng)) {
      return {
        success: false,
        error: "Invalid coordinates received from geocoding service",
      };
    }

    // Geocoded successfully; return coordinates without verbose logging

    return {
      success: true,
      lat,
      lng,
    };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown geocoding error",
    };
  }
}
