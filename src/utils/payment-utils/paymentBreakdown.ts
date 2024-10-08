import { TAX_PERCENTAGE } from "../constants";
import { SUPERHOG_FEE } from "@/utils/constants";
import { getNumNights } from "../utils";
import { TripCheckout } from "../../server/db/schema/tables/payments";

export function breakdownPayment({
  checkIn,
  checkOut,
  numOfNights,
  travelerOfferedPriceBeforeFees,
  isScrapedPropery,
  originalPrice,
}: {
  checkIn?: Date; // Make checkIn and checkOut optional
  checkOut?: Date;
  numOfNights?: number; // Make numOfNights optional
  travelerOfferedPriceBeforeFees: number;
  isScrapedPropery: boolean;
  originalPrice?: number | null;
}) {
  // Calculate numOfNights if checkIn and checkOut are provided
  if (checkIn && checkOut) {
    numOfNights = getNumNights(checkIn, checkOut);
  }

  // Error handling if neither is provided
  if (numOfNights === undefined) {
    throw new Error("Either checkIn/checkOut or numOfNights must be provided.");
  }

  // ---- if scrape property different structure(excludes superhog and taxes)
  let totalTripAmount;
  let superhogFee = 0;
  let taxesPaid = 0;
  let stripeTransactionFee; // scraped = travelerOfferedPrice 2. direct listing = travelerOfferedPrice + tax + superhog

  if (isScrapedPropery) {
    stripeTransactionFee = Math.ceil(
      travelerOfferedPriceBeforeFees * 0.029 + 30,
    );

    const scrapePropertyTotalPrice =
      travelerOfferedPriceBeforeFees + stripeTransactionFee;

    totalTripAmount = scrapePropertyTotalPrice;
  } else {
    // --------- OUR PROPERTY ------------
    superhogFee = numOfNights * SUPERHOG_FEE * 100;
    taxesPaid = Math.round(
      (travelerOfferedPriceBeforeFees + superhogFee) * TAX_PERCENTAGE,
    );

    stripeTransactionFee = Math.ceil(
      (travelerOfferedPriceBeforeFees + superhogFee + taxesPaid) * 0.029 + 30,
    );
    const totalTripAmountForOurProperty =
      travelerOfferedPriceBeforeFees +
      superhogFee +
      taxesPaid +
      stripeTransactionFee;

    totalTripAmount = totalTripAmountForOurProperty;
  }

  let totalSavings = originalPrice ? originalPrice - totalTripAmount : 0; //// um hopefully not negative
  //if totalSavings is negative just make it zero dude
  if (totalSavings < 0) {
    console.log(totalSavings);
    totalSavings = 0;
  }

  return {
    totalTripAmount,
    paymentIntentId: "",
    taxesPaid,
    taxPercentage: isScrapedPropery ? 0 : TAX_PERCENTAGE,
    superhogFee,
    stripeTransactionFee,
    checkoutSessionId: "",
    totalSavings,
  };
}

export const getServiceFee = ({
  tripCheckout,
}: {
  tripCheckout: TripCheckout;
}) => {
  const serviceFee =
    tripCheckout.superhogFee + tripCheckout.stripeTransactionFee;
  return serviceFee;
};
