import {
  HOST_MARKUP,
  REMOVE_TRAVELER_MARKUP,
  SUPERHOG_FEE_CENTS_PER_NIGHT,
  TRAVELER_MARKUP,
} from "../constants";
import { getTaxPercentage } from "@/utils/payment-utils/calculateTax";
import { Offer, Property } from "@/server/db/schema";
import type {
  UnwrapHostOfferAmountFromTravelerRequestOutput,
  PriceBreakdownOutput,
  PropertyAndTripParams,
} from "@/components/checkout/types";
import { getNumNights, removeTravelerMarkup } from "../utils";
import { getAdditionalFees, getStripeFee } from "./payment-utils";
import type { HostDashboardRequest } from "@/components/requests/RequestCard";
import type { MyPartialProperty } from "./payment-utils";

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

// <------------------------------------------------------------------- HOST CITY REQUEST/ OFFER -------------------------------------------------------------------------->

export const requestAmountToBaseOfferedAmount = (
  maxTotalPrice: number, //comes from the request table
): number => {
  //we need to convert the travelerRequestAmount from the request form to the base amount which is what the host sees on the request/city page
  const baseOfferedAmount = maxTotalPrice * (1 - REMOVE_TRAVELER_MARKUP);

  return baseOfferedAmount; //NOTE: Unlike Request-to-book/Bids the offer's traveler markup is also marking up the additional fees.
};

export const baseAmountToHostPayout = (
  baseAmount: number, //comes from the request table
): number => {
  //we need to convert the travelerRequestAmount from the request form to the base amount which is what the host sees on the request/city page
  const hostPayout = Math.ceil(baseAmount * HOST_MARKUP);
  console.log();
  return hostPayout; //NOTE: Unlike Request-to-book/Bids the offer's traveler markup is also marking up the additional fees.
};

export const unwrapHostOfferAmountFromTravelerRequest = ({
  property,
  request,
  hostInputOfferAmount,
}: {
  property: MyPartialProperty;
  request: HostDashboardRequest;
  hostInputOfferAmount?: number;
}): UnwrapHostOfferAmountFromTravelerRequestOutput => {
  console.log("request.maxTotalPrice (Traveler Total):", request.maxTotalPrice);

  const baseOfferedAmount = hostInputOfferAmount ?? request.maxTotalPrice; // Total amount traveler pays

  console.log("baseOfferedAmount (Traveler Total):", baseOfferedAmount);

  const additionalFees = getAdditionalFees({
    property: property,
    numOfNights: getNumNights(request.checkIn, request.checkOut),
    numOfPets: undefined,
    numOfGuests: request.numGuests,
  });

  const priceBeforeFees =
    baseOfferedAmount - additionalFees.totalAdditionalFees;

  console.log("priceBeforeFees (Base Price Component):", priceBeforeFees);

  const HOST_MARKUP = 0.975; // Host keeps 97.5%, Service fee is 2.5%
  const serviceFeePercentage = 1 - HOST_MARKUP; // 0.025 or 2.5%

  const hostServiceFee = Math.round(priceBeforeFees * serviceFeePercentage);

  console.log("hostServiceFee (2.5% of Base Price Component):", hostServiceFee);

  const hostBasePayout = priceBeforeFees * HOST_MARKUP;

  console.log("hostBasePayout (Host Share of Base Price):", hostBasePayout);

  const hostTotalPayout = hostBasePayout + additionalFees.totalAdditionalFees;

  //in this function we are removing the Host fees ONLY FROM THE basePropertyPrice and not from the Additonal Fees
  console.log(
    "hostTotalPayout (Final Host Payout with Add. Fees):",
    hostTotalPayout,
  );

  return {
    hostServiceFee,
    baseOfferedAmount,
    hostBasePayout, // payout without the additional fees
    hostTotalPayout, //total payout
    additionalFees,
    priceBeforeFees, // Added for clarity, the base price before fees and markup
  };
};
export function getTravelerOfferedPrice({
  //for offeres only we are including additional fees in the mark up
  totalBasePriceBeforeFees,
  travelerMarkup = TRAVELER_MARKUP,
}: {
  totalBasePriceBeforeFees: number;
  travelerMarkup?: number;
}) {
  return Math.ceil(totalBasePriceBeforeFees * travelerMarkup);
}
