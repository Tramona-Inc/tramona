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

  if (!addressComponents) {
    return {
      city: "[Unknown]",
      county: "[Unknown]",
      stateName: "[Unknown]",
      stateCode: "[Unknown]",
      country: "[Unknown]",
    };
  }

  const countryComponent = addressComponents.find((component) =>
    component.types.includes("country"),
  );

  const cityComponent = addressComponents.find(
    (component) =>
      component.types.includes("locality") ||
      component.types.includes("sublocality") ||
      component.types.includes("neighborhood") ||
      component.types.includes("administrative_area_level_3"),
  );

  const stateComponent = addressComponents.find((component) =>
    component.types.includes("administrative_area_level_1"),
  );

  const countyComponent = addressComponents.find((component) =>
    component.types.includes("administrative_area_level_2"),
  )?.long_name;

  let city = cityComponent?.long_name;

  // Map specific neighborhoods to their parent cities
  if (cityComponent?.types.includes("neighborhood")) {
    const parentLocality = addressComponents.find(
      (component) =>
        component.types.includes("locality") ||
        component.types.includes("sublocality") ||
        component.types.includes("administrative_area_level_3"),
    );
    if (parentLocality) {
      city = parentLocality.long_name;
    }
  }

  return {
    city: city ?? "[Unknown]",
    county: countyComponent ?? "[Unknown]",
    stateName: stateComponent?.long_name ?? "[Unknown]", // State name
    stateCode: stateComponent?.short_name ?? "[Unknown]", // State code (abbreviation)
    country: (countryComponent?.short_name ?? countryComponent?.long_name) ?? "[Unknown]",
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
