import { env } from "@/env";
import { Client } from "@googlemaps/google-maps-services-js";

export const googleMaps = new Client({});

export async function getCoordinates(address: string) {
  return await googleMaps
    .geocode({
      params: {
        address,
        key: env.GOOGLE_MAPS_KEY,
      },
    })
    .then((res) => {
      const location = res.data.results[0]?.geometry.location;
      const bounds = res.data.results[0]?.geometry.bounds;

      return { location, bounds };
    });
}

/**
 * Example outputs:
 * - "San Francisco, CA, US"
 * - "New York, NY, US"
 * - "London, United Kingdom"
 * - "Paris, France"
 */
export async function getCity({ lat, lng }: { lat: number; lng: number }) {
  const addressComponents = await googleMaps
    .reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: env.GOOGLE_MAPS_KEY,
      },
    })
    .then((res) => res.data.results[0]?.address_components);

  if (!addressComponents) return "[Unknown location]";

  const country = addressComponents.find((component) =>
    component.types.includes("country"),
  );

  const city = addressComponents.find((component) =>
    component.types.includes("locality"),
  )?.long_name;

  const state = addressComponents.find((component) =>
    component.types.includes("administrative_area_level_1"),
  )?.short_name;

  if (!country || !city) return "[Unknown location]";

  if (country.short_name === "US") {
    if (state) return `${city}, ${state}, ${country.short_name}`;
    return `${city}, ${country.short_name}`;
  }

  return `${city}, ${country.long_name || country.short_name}`;
}
