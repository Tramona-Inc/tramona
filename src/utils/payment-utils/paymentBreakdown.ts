import { SUPERHOG_FEE_CENTS_PER_NIGHT } from "../constants";
import { TripCheckout } from "../../server/db/schema/tables/payments";
import { getTaxPercentage } from "@/utils/payment-utils/calculateTax";
import { Offer, Property } from "@/server/db/schema";
import type {
  PriceBreakdownOutput,
  PropertyAndTripParams,
} from "@/components/checkout/types";
import { getNumNights } from "../utils";

// -------------------------- 2 Different inputs for Breakdown payment  -------------------------
// -----METHOD 1. USING OFFER
export function breakdownPaymentByOffer( ///// USING OFFER
  offer: Pick<
    Offer,
    | "scrapeUrl"
    | "travelerOfferedPriceBeforeFees"
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
      | "maxGuestsWithoutFee"
      | "extraGuestFeePerNight"
      | "cleaningFeePerStay"
      | "petFeePerStay"
    >;
  },
  numberOfGuests: number, //just leaving this here just in case host want their payment breakdowns.
): PriceBreakdownOutput {
  //SOMTHING TO KEEP IN MIND
  //additionalFees are not neccessary here becuase the TravelerOfferedPrice already accounts for additionalFees.
  const numNights = getNumNights(offer.checkIn, offer.checkOut);
  const isScraped = offer.scrapeUrl !== null;

  const taxPercentage = isScraped ? 0 : getTaxPercentage(offer.property);
  const superhogFee = isScraped ? 0 : numNights * SUPERHOG_FEE_CENTS_PER_NIGHT;

  const taxesPaid = Math.round(
    (offer.travelerOfferedPriceBeforeFees + superhogFee) * taxPercentage,
  );
  const totalBeforeStripeFee =
    offer.travelerOfferedPriceBeforeFees + superhogFee + taxesPaid;

  const stripeFee = getStripeFee(totalBeforeStripeFee);
  //  <-------  totalTripAmount -------->
  const totalTripAmount = totalBeforeStripeFee + stripeFee;
  console.log(totalTripAmount);

  //for savings
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
    cleaningFeePerStay: undefined,
    petFeePerStay: undefined,
    totalExtraGuestFee: undefined,
    totalAdditionalFees: undefined,
  };
}

//------METHOD 2. Using UnifiedCheckoutData OR Request to book + Property  as inputs ------------
export function breakdownPaymentByPropertyAndTripParams( //TAKE PRICE PER NIGHT AND RETURNS TOTAL NIGHTS
  propertyAndTripParams: PropertyAndTripParams,
): PriceBreakdownOutput {
  console.log(propertyAndTripParams.travelerPriceBeforeFees);

  const numNights = getNumNights(
    propertyAndTripParams.dates.checkIn,
    propertyAndTripParams.dates.checkOut,
  );
  const isScraped = propertyAndTripParams.property.originalListingUrl !== null;

  //gettting addutional Fees
  const additionalFees = getAdditionalFees({
    property: propertyAndTripParams.property,
    numOfGuests: propertyAndTripParams.numOfGuests,
    numNights,
  });

  const taxPercentage = isScraped
    ? 0
    : getTaxPercentage(propertyAndTripParams.property);

  const superhogFee = isScraped ? 0 : numNights * SUPERHOG_FEE_CENTS_PER_NIGHT;

  const taxesPaid = Math.round(
    (propertyAndTripParams.travelerPriceBeforeFees +
      superhogFee +
      additionalFees.totalFees) *
      taxPercentage,
  );

  const totalBeforeStripeFee =
    propertyAndTripParams.travelerPriceBeforeFees +
    additionalFees.totalFees +
    superhogFee +
    taxesPaid;

  console.log(totalBeforeStripeFee);

  const stripeFee = getStripeFee(totalBeforeStripeFee);
  console.log(stripeFee);
  const totalTripAmount = Math.round(totalBeforeStripeFee + stripeFee);

  //savings

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
    totalTripAmount, //entire trip
    taxesPaid,
    taxPercentage,
    superhogFee,
    stripeTransactionFee: stripeFee,
    totalSavings,
    cleaningFeePerStay: additionalFees.cleaningFeePerStay,
    petFeePerStay: additionalFees.petFeePerStay,
    totalExtraGuestFee: additionalFees.totalExtraGuestFee,
    totalAdditionalFees: additionalFees.totalFees, //includes guest, pet and cleaning
  };
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

interface AdditionalFees {
  cleaningFeePerStay: number | null;
  petFeePerStay: number | null;
  totalExtraGuestFee: number | null;
  totalFees: number;
}

export function getAdditionalFees({
  //For now this is not for offers (PLEASE DELETE THIS COMMENT IF THAT CHANGES :D)
  property,
  numOfGuests,
  numNights,
}: {
  property: Pick<
    Property,
    | "maxGuestsWithoutFee"
    | "extraGuestFeePerNight"
    | "cleaningFeePerStay"
    | "petFeePerStay"
  >;
  numOfGuests: number;
  numNights: number;
}): AdditionalFees {
  const maxGuestsWithoutFee = property.maxGuestsWithoutFee ?? null;
  const extraGuestFeePerNight = property.extraGuestFeePerNight;
  const cleaningFeePerStay = property.cleaningFeePerStay;
  //const petFeePerStay = property.petFeePerStay;
  const petFeePerStay = 0;

  let totalExtraGuestFee: number | null = null;

  if (maxGuestsWithoutFee !== null && numOfGuests > maxGuestsWithoutFee) {
    totalExtraGuestFee =
      (numOfGuests - maxGuestsWithoutFee) * extraGuestFeePerNight * numNights;
  }

  const totalFees =
    (totalExtraGuestFee ? totalExtraGuestFee : 0) +
    (cleaningFeePerStay ? cleaningFeePerStay : 0) +
    (petFeePerStay ? petFeePerStay : 0); //dont delete this error becuase we dont have pet fees yet

  return {
    cleaningFeePerStay,
    petFeePerStay,
    totalExtraGuestFee,
    totalFees,
  };
}

//HOST REVERSALS FUNCTIONS
