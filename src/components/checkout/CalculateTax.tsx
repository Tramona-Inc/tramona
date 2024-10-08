import { calculateTotalTax } from "@/utils/taxData";
import { sumBy } from "lodash";

export function getTax({ location }: { location: string }) {
  const usAddressRegex = /(.+),\s*([A-Z]{2})\s*\d{5},\s*(USA)/;

  // Match the address against the regex
  const match = location.match(usAddressRegex);

  if (match) {
    const [fullMatch, city, state, country] = match;

    if (!city || !state || !country) {
      throw new Error("Invalid US address format");
    }

    const totalTaxRate = sumBy(calculateTotalTax(country, state, city), (tax) => tax.taxRate);

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
