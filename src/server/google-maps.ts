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
export async function getAddress({ lat, lng }: { lat: number; lng: number }) {
  const result = await googleMaps
    .reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: env.GOOGLE_MAPS_KEY,
      },
    })
    .then((res) => res.data.results[0]);

  if (!result) {
    throw new Error(`No result found for ${lat}, ${lng}`);
  }

  const findComponent = (types: string[]) =>
    result.address_components.find((component) =>
      component.types.some((type) => types.includes(type)),
    );

  const countryComponent = findComponent(["country"]);
  const stateComponent = findComponent(["administrative_area_level_1"]);
  const county = findComponent(["administrative_area_level_2"])?.long_name;
  const postalCode = findComponent(["postal_code"])?.long_name;
  const city = findComponent([
    "locality",
    "sublocality",
    "administrative_area_level_3",
    "postal_town",
  ])?.long_name;

  return {
    city,
    county,
    postalCode,
    stateName: stateComponent?.long_name, // State name
    stateCode: stateComponent?.short_name, // State code (abbreviation)
    country: countryComponent?.short_name,
    countryISO: countryComponent?.long_name,
  };
}

// export async function getCity({ lat, lng }: { lat: number; lng: number }) {
//   const addressComponents = await googleMaps
//     .reverseGeocode({
//       params: {
//         latlng: { lat, lng },
//         key: env.GOOGLE_MAPS_KEY,
//       },
//     })
//     .then((res) => res.data.results[0]?.address_components);

//   if (!addressComponents) return "[Unknown location]";

//   const country = addressComponents.find((component) =>
//     component.types.includes("country"),
//   );

//   const cityComponent = addressComponents.find(
//     (component) =>
//       component.types.includes("locality") ||
//       component.types.includes("sublocality") ||
//       component.types.includes("neighborhood") ||
//       component.types.includes("administrative_area_level_3"),
//   );

//   const state = addressComponents.find((component) =>
//     component.types.includes("administrative_area_level_1"),
//   )?.short_name;

//   const county = addressComponents.find((component) =>
//     component.types.includes("administrative_area_level_2"),
//   )?.long_name;

//   let city = cityComponent?.long_name;

//   // Map specific neighborhoods to their parent cities
//   if (cityComponent?.types.includes("neighborhood")) {
//     const parentLocality = addressComponents.find(
//       (component) =>
//         component.types.includes("locality") ||
//         component.types.includes("sublocality") ||
//         component.types.includes("administrative_area_level_3"),
//     );
//     if (parentLocality) {
//       city = parentLocality.long_name;
//     }
//   }

//   if (!country || !city) return "[Unknown location]";

//  let location = `${city}, ${state ?? ''}, ${country.short_name || ''}`;

//   // Include county if available and country is US
//   if (country.short_name === "US" && county) {
//     location = `${city}, ${county}, ${state || ''}, ${country.short_name}`;
//   }

//   return location.trim();
// }

export async function getCountryISO({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<string | null> {
  const addressComponents = await googleMaps
    .reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: env.GOOGLE_MAPS_KEY,
      },
    })
    .then((res) => res.data.results[0]?.address_components);

  if (!addressComponents) return null;

  const country = addressComponents.find((component) =>
    component.types.includes("country"),
  );

  return country ? country.short_name : null;
}

export async function getPostcode({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}): Promise<string | null> {
  const addressComponents = await googleMaps
    .reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: env.GOOGLE_MAPS_KEY,
      },
    })
    .then((res) => res.data.results[0]?.address_components);

  if (!addressComponents) return null;

  const postalCode = addressComponents.find((component) =>
    component.types.includes("postal_code"),
  );

  return postalCode ? postalCode.long_name : null;
}
