import { env } from "@/env";
import { Client, Language } from "@googlemaps/google-maps-services-js";

export const googleMaps = new Client({
  config: {},
});

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
  const firstResult = await googleMaps
    .reverseGeocode({
      params: {
        latlng: { lat, lng },
        key: env.GOOGLE_MAPS_KEY,
        language: Language.en,
      },
    })
    .then((res) => res.data.results[0]);

  if (!firstResult) {
    throw new Error(`No results found for lat/lng ${lat}/${lng}`);
  }

  console.log(JSON.stringify(firstResult.address_components, null, 2));

  const findComponent = (types: string[]) => {
    return firstResult.address_components.find((c) =>
      c.types.some((type) => types.includes(type)),
    );
  };

  const countryComponent = findComponent(["country"]);
  const stateComponent = findComponent(["administrative_area_level_1"]);
  const countyComponent = findComponent(["administrative_area_level_2"]);
  const postcodeComponent = findComponent(["postal_code"]);
  const cityComponent =
    findComponent(["locality", "administrative_area_level_2", "postal_town"]) ??
    findComponent(["administrative_area_level_1"]) ??
    findComponent(["administrative_area_level_3"]) ??
    findComponent(["sublocality_level_1"]);

  // since all locations of properties should have at least a city and country,
  // we can throw an error if they're missing

  if (!cityComponent) {
    throw new Error(
      `City not found for ${lat}, ${lng}\nrev geo result: ${JSON.stringify(
        firstResult.address_components,
        null,
        2,
      )}`,
    );
  }

  if (!countryComponent) {
    throw new Error(
      `Country not found for ${lat}, ${lng}\nrev geo result: ${JSON.stringify(
        firstResult.address_components,
        null,
        2,
      )}`,
    );
  }

  return {
    postcode: postcodeComponent?.long_name ?? null,
    county: countyComponent?.long_name ?? null,
    city: cityComponent.long_name, // non-null

    stateName: stateComponent?.long_name ?? null,
    stateCode:
      stateComponent?.short_name === stateComponent?.long_name
        ? null
        : (stateComponent?.short_name ?? null),

    country: countryComponent.long_name, // non-null
    countryISO: countryComponent.short_name, // non-null
  };
}

export function stringifyAddress(
  addressComponents: Awaited<ReturnType<typeof getAddress>>,
) {
  if (addressComponents.stateCode) {
    return `${addressComponents.city}, ${addressComponents.stateCode}, ${addressComponents.countryISO}`;
  }

  return `${addressComponents.city}, ${addressComponents.countryISO}`;
}
