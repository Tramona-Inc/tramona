import { SUPERHOG_FEE_CENTS_PER_NIGHT } from "../constants";
import { TripCheckout } from "../../server/db/schema/tables/payments";
import { getTaxPercentage } from "@/utils/payment-utils/calculateTax";
import { Offer, Property } from "@/server/db/schema";
import { getNumNights } from "../utils";

export function breakdownPayment(
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
    >;
  },
) {
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
  const totalTripAmount = totalBeforeStripeFee + stripeFee;

  const { originalNightlyPrice } = offer.property;

  const originalTotalPrice =
    offer.datePriceFromAirbnb ??
    (originalNightlyPrice ? originalNightlyPrice * numNights : null);

  let totalSavings = originalTotalPrice
    ? originalTotalPrice - totalTripAmount
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
