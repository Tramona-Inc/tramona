import { SUPERHOG_FEE_CENTS_PER_NIGHT } from "../constants";
import { TripCheckout } from "../../server/db/schema/tables/payments";
import { getTaxPercentage } from "@/utils/payment-utils/calculateTax";
import { Offer, Property } from "@/server/db/schema";
import type {
  PriceBreakdownOutput,
  PropertyAndTripParams,
} from "@/components/checkout/types";
import { getNumNights, removeTravelerMarkup } from "../utils";

// -------------------------- 2 Different inputs for Breakdown payment  -------------------------
// -----METHOD 1. USING OFFER
export function breakdownPaymentByOffer( ///// USING OFFER
  offer: Pick<
    Offer,
    | "scrapeUrl"
    | "calculatedTravelerPrice"
    | "datePriceFromAirbnb"
    | "checkIn"
    | "checkOut"
  > & {
    property: Pick<
      Property,
      | "originalNightlyPrice"
      | "city"
      | "county"
      | "stateName"
      | "stateCode"
      | "country"
    >;
  },
): PriceBreakdownOutput {
  const numNights = getNumNights(offer.checkIn, offer.checkOut);
  const isScraped = offer.scrapeUrl !== null;

  const taxPercentage = isScraped ? 0 : getTaxPercentage(offer.property);
  const superhogFee = isScraped ? 0 : numNights * SUPERHOG_FEE_CENTS_PER_NIGHT;
  const taxesPaid = Math.round(
    (offer.calculatedTravelerPrice + superhogFee) * taxPercentage,
  );
  const totalBeforeStripeFee =
    offer.calculatedTravelerPrice + superhogFee + taxesPaid;
  const stripeFee = getStripeFee(totalBeforeStripeFee);
  const totalTripAmount = totalBeforeStripeFee + stripeFee;
  console.log(totalTripAmount);

  const { originalNightlyPrice } = offer.property;

  const originalTotalBasePriceBeforeFees =
    offer.datePriceFromAirbnb ??
    (originalNightlyPrice ? originalNightlyPrice * numNights : null);
  let totalSavings = originalTotalBasePriceBeforeFees
    ? originalTotalBasePriceBeforeFees - totalTripAmount
    : 0; //// um hopefully not negative

  //if totalSavings is negative just make it zero dude
  if (totalSavings < 0) {
    console.log(totalSavings);
    totalSavings = 0;
  }

  return {
    totalTripAmount,
    taxesPaid,
    taxPercentage,
    superhogFee,
    stripeTransactionFee: stripeFee,
    totalSavings,
  };
}
//------METHOD 2. Using UnifiedCheckoutData OR Request to book + Property  as inputs ------------
export function breakdownPaymentByPropertyAndTripParams(
  propertyAndTripParams: PropertyAndTripParams,
): PriceBreakdownOutput {
  console.log(propertyAndTripParams.calculatedTravelerPrice);
  const numNights = getNumNights(
    propertyAndTripParams.dates.checkIn,
    propertyAndTripParams.dates.checkOut,
  );
  const isScraped = propertyAndTripParams.property.originalListingUrl !== null;

  const taxPercentage = isScraped
    ? 0
    : getTaxPercentage(propertyAndTripParams.property);
  const superhogFee = isScraped ? 0 : numNights * SUPERHOG_FEE_CENTS_PER_NIGHT;
  const taxesPaid = Math.round(
    (propertyAndTripParams.calculatedTravelerPrice + superhogFee) *
      taxPercentage,
  );

  const totalBeforeStripeFee =
    propertyAndTripParams.calculatedTravelerPrice + superhogFee + taxesPaid;
  console.log(totalBeforeStripeFee);
  const stripeFee = getStripeFee(totalBeforeStripeFee);
  console.log(stripeFee);
  const totalTripAmount = Math.round(totalBeforeStripeFee + stripeFee);

  const { originalNightlyPrice } = propertyAndTripParams.property;

  const originalTotalBasePriceBeforeFees = originalNightlyPrice
    ? originalNightlyPrice * numNights
    : null;

  let totalSavings = originalTotalBasePriceBeforeFees
    ? originalTotalBasePriceBeforeFees - totalTripAmount
    : 0; //// um hopefully not negative

  //if totalSavings is negative just make it zero dude
  if (totalSavings < 0) {
    console.log(totalSavings);
    totalSavings = 0;
  }
  return {
    totalTripAmount,
    taxesPaid,
    taxPercentage,
    superhogFee,
    stripeTransactionFee: stripeFee,
    totalSavings,
  };
}

export function unwrapCalculatedTravelerPriceToCalculatedBasePrice({
  //USE ONLY WITH REQUEST TO BOOK
  calculatedTravelerPrice,
  additionalFees,
}: {
  calculatedTravelerPrice: number;
  additionalFees: number;
}) {
  const calculatedBasePrice = removeTravelerMarkup(
    calculatedTravelerPrice - additionalFees,
  );

  return calculatedBasePrice;
}

export function getServiceFee({
  tripCheckout,
}: {
  tripCheckout: Pick<TripCheckout, "superhogFee" | "stripeTransactionFee">;
}) {
  const serviceFee =
    tripCheckout.superhogFee + tripCheckout.stripeTransactionFee;
  return serviceFee;
}

export function getStripeFee(amount: number) {
  return Math.ceil(amount * 0.029 + 30);
}
