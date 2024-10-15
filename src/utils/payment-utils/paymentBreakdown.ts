import { TAX_PERCENTAGE } from "../constants";
import { SUPERHOG_FEE } from "@/utils/constants";
import { getNumNights } from "../utils";
import { TripCheckout } from "../../server/db/schema/tables/payments";
import { getTax } from "@/utils/payment-utils/calculateTax";

export async function breakdownPayment({
  checkIn,
  checkOut,
  numOfNights,
  travelerOfferedPriceBeforeFees,
  isScrapedPropery,
  originalPrice,
  lat,
  lng,
}: {
  checkIn?: Date; // Make checkIn and checkOut optional
  checkOut?: Date;
  numOfNights?: number; // Make numOfNights optional
  travelerOfferedPriceBeforeFees: number;
  isScrapedPropery: boolean;
  originalPrice?: number | null;
  lat?: number;
  lng?: number;
}) {
  // Calculate numOfNights if checkIn and checkOut are provided
  if (checkIn && checkOut) {
    numOfNights = getNumNights(checkIn, checkOut);
  }

  // Error handling if neither is provided
  if (numOfNights === undefined) {
    throw new Error("Either checkIn/checkOut or numOfNights must be provided.");
  }

  //calculate tax

  const calculatedTax =
    lat && lng
      ? await getTax({
          lat,
          lng,
        })
      : TAX_PERCENTAGE;

  console.log(calculatedTax);

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
      (travelerOfferedPriceBeforeFees + superhogFee) * calculatedTax,
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
    taxPercentage: isScrapedPropery ? 0 : calculatedTax,
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
