import { TAX_PERCENTAGE } from "../constants";
import { SUPERHOG_FEE } from "@/utils/constants";
import { getNumNights } from "../utils";

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

  const superhogPaid = numOfNights * SUPERHOG_FEE * 100;
  const taxesPaid = Math.round(
    travelerOfferedPriceBeforeFees + superhogPaid * TAX_PERCENTAGE,
  );

  const stripeTransactionFee = Math.ceil(
    (travelerOfferedPriceBeforeFees + superhogPaid + taxesPaid) * 0.0029 + 30,
  );

  // ---- if scrape property different structure(excludes superhog and taxes)
  let totalTripAmount;

  if (isScrapedPropery) {
    const scrapePropertyTotalPrice =
      travelerOfferedPriceBeforeFees + stripeTransactionFee;

    totalTripAmount = scrapePropertyTotalPrice;
  } else {
    const totalTripAmountForOurProperty =
      travelerOfferedPriceBeforeFees +
      superhogPaid +
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
    taxPercentage: TAX_PERCENTAGE,
    superhogPaid,
    stripeTransactionFee,
    checkoutSessionId: "",
    totalSavings,
  };
}
