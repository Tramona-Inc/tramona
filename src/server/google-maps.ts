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

export async function getAddress({ lat, lng }: { lat: number; lng: number }) {
  return await googleMaps
    .reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: env.GOOGLE_MAPS_KEY,
      },
    })
    .then((res) => res.data.results[0]?.address_components);
}
