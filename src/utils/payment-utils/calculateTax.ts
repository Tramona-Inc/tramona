import { calculateTotalTax } from "@/utils/payment-utils/taxData";
import { sumBy } from "lodash";
import { getCity } from "@/server/google-maps";
import { TAX_PERCENTAGE } from "../constants";

export async function getTax({ lat, lng }: { lat: number; lng: number }) {
  //const usAddressRegex = /(.+),\s*([A-Z]{2})\s*\d{5},\s*(USA)/;

  // Match the address against the regex
  //const match = location.match(usAddressRegex);
  console.log(lat, lng);
  const { city, county, stateName, stateCode, country } = await getCity({
    lat,
    lng,
  });

  console.log(city, county, stateName, stateCode, country);

  if (city) {
    //const [fullMatch, city, state, country] = match;

    if (!city || !stateName || !country) {
      throw new Error("Invalid US address format");
    }

    let totalTaxRate = sumBy(
      calculateTotalTax(country, stateCode, city),
      (tax) => tax.taxRate,
    );

    console.log(totalTaxRate);
    if (totalTaxRate <= 0) {
      totalTaxRate = TAX_PERCENTAGE;
    }

    return totalTaxRate;
  } else {
    throw new Error("Invalid US address format");
  }
}

// function calculateTaxPercentage({
//   city,
//   state,
//   country,
// }: {
//   city: string;
//   state: string;
//   country: string;
// }) {
//   // Retrieve tax rates
//   const countryTax = taxRates[country];
//   if (!countryTax) {
//     throw new Error(`Tax rates not defined for country: ${country}`);
//   }

//   const stateTax = countryTax[state];
//   if (!stateTax) {
//     throw new Error(`Tax rates not defined for state: ${state} in country: ${country}`);
//   }

//   const stateRate = stateTax.stateRate || 0;
//   const cityRate = stateTax.cities[city] || 0;

//   // Calculate tax
//   const totalTaxRate = stateRate + cityRate;

//   return totalTaxRate;
// };
