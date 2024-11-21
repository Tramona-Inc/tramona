import { Property } from "@/server/db/schema";

type CityTaxRates = Record<string, Record<string, number>>; // Maps city names to taxes

type StateTaxRates = {
  stateRate?: Record<string, number>; // Optional state tax rate, any string key is allowed
  cities?: CityTaxRates; // Optional cities and their tax rates
};

type CountryTaxRates = Record<string, StateTaxRates | null>; // States can be null if a country doesn't have states

type TaxRates = Record<string, CountryTaxRates | null>;

//if tax rate array is null then it wont show

export const taxRates: TaxRates = {
  US: {
    CA: {
      cities: {
        "San Diego": {
          "San Diego Transit Occupancy Tax": 0.105,
        },
        // "Los Angeles": {
        //   "San Diego Transit Occupancy Tax": 0.105,
        // },
        // Add more cities as needed
      },
    },
    TX: {
      stateRate: {
        "Texas State Hotel Occupancy Tax": 60,
      },
      cities: {
        Austin: {
          "Austin Hotel Occupancy Tax": 11.0,
        },
        // Add more cities as needed
      },
    },
    // Add more states as needed
  },
  // "Puerto Rico": {
  //   stateRate: {
  //     "Puerto Rico Room Tax": 7.0,
  //     // comments: "the listing price, including any cleaning fees, for reservations of 89 nights or shorter.",
  //   },
  // },
  // Add more countries if necessary
};

type TaxDetail = {
  taxName: string;
  taxRate: number;
};

export function calculateTotalTax({
  country,
  stateCode,
  city,
}: Pick<Property, "country" | "stateCode" | "city">): TaxDetail[] {
  const countryData = taxRates[country];
  if (!countryData) return [];

  if (country === "Puerto Rico") {
    return [{ taxName: "Puerto Rico Room Tax", taxRate: 0.07 }];
  }

  if (!stateCode) return [];

  const stateData = countryData[stateCode];
  if (!stateData) return [];

  if (
    stateData.hasOwnProperty("cities") &&
    !stateData.cities?.hasOwnProperty(city)
  ) {
    return [];
  }

  const taxDetails: TaxDetail[] = [];

  // Add state-level taxes if they exist
  if (stateData.stateRate) {
    for (const [taxName, taxRate] of Object.entries(stateData.stateRate)) {
      taxDetails.push({ taxName, taxRate });
    }
  }

  // Add city-level taxes if a city is specified and the city exists
  if (city && stateData.cities?.[city]) {
    for (const [taxName, taxRate] of Object.entries(stateData.cities[city])) {
      taxDetails.push({ taxName, taxRate });
    }
  }

  return taxDetails;
}
