import { breakdownPaymentByOffer } from "@/utils/payment-utils/paymentBreakdown";
import { UnifiedCheckoutData } from "./types";
import { RouterOutputs } from "@/utils/api";
import { PropertyPageData } from "../propertyPages/PropertyPage";
import { getApplicableBookItNowAndRequestToBookDiscountPercentage } from "../../utils/payment-utils/payment-utils";

type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];

export function offerToUnifiedCheckout({
  offer,
}: {
  offer: OfferWithDetails;
}): UnifiedCheckoutData {
  const { totalSavings } = breakdownPaymentByOffer(offer);

  //first create the requestToBookPricing
  const pricing = {
    calculatedTravelerPrice: offer.calculatedTravelerPrice,
    datePriceFromAirbnb: offer.datePriceFromAirbnb,
    discount: totalSavings,
    additionalFees: null, //comeback to this make a reusable function that can extract the fees from the property // it should not effect the pricing here tho
  };

  return {
    type: "offer",
    offerId: offer.id,
    dates: {
      checkIn: offer.checkIn,
      checkOut: offer.checkOut,
    },
    scrapeUrl: offer.scrapeUrl,
    guests: offer.request?.numGuests ?? offer.property.maxNumGuests,
    property: offer.property,
    pricing,
  };
}

export function requestOrBookItNowToUnifiedData({
  checkIn,
  checkOut,
  numGuests,
  calculatedTravelerPrice,
  additionalFees,
  requestPercentageOff,
  property,
  type,
}: {
  checkIn: Date;
  checkOut: Date;
  calculatedTravelerPrice: number;
  additionalFees: number;
  numGuests: number;
  requestPercentageOff?: number;
  property: PropertyPageData;
  type: "bookItNow" | "requestToBook";
}): UnifiedCheckoutData {
  //first create the requestToBookPricing
  const pricing = {
    calculatedTravelerPrice: calculatedTravelerPrice,
    datePriceFromAirbnb: 0,
    discount:
      getApplicableBookItNowAndRequestToBookDiscountPercentage(property),
    additionalFees: additionalFees, //Have to pass through stripe-webhook to prevent host future price change in same bid
    requestPercentageOff: requestPercentageOff,
  };

  return {
    type,
    dates: {
      checkIn: checkIn,
      checkOut: checkOut,
    },
    scrapeUrl: property.originalListingUrl,
    guests: numGuests,
    property: property,
    pricing,
  };
}
