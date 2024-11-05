import { calculateTotalTax } from "@/utils/payment-utils/taxData";
import { sumBy } from "lodash";
import { TAX_PERCENTAGE } from "../constants";
import { Property } from "@/server/db/schema";

export function getTaxPercentage(
  property: Pick<Property, "city" | "county" | "stateCode" | "country">,
) {
  let totalTaxRate = sumBy(calculateTotalTax(property), (tax) => tax.taxRate);

  console.log(totalTaxRate);
  if (totalTaxRate <= 0) {
    totalTaxRate = TAX_PERCENTAGE;
  }

  return totalTaxRate;
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
