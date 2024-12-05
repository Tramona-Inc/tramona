import { breakdownPaymentByOffer } from "@/utils/payment-utils/paymentBreakdown";
import { UnifiedCheckoutData } from "./types";
import { RouterOutputs } from "@/utils/api";
import { PropertyPageData } from "../propertyPages/PropertyPage";

type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];

export function offerToUnifiedCheckout({
  offer,
}: {
  offer: OfferWithDetails;
}): UnifiedCheckoutData {
  const { totalSavings } = breakdownPaymentByOffer(offer);

  //first create the requestToBookPricing
  const pricing = {
    travelerOfferedPriceBeforeFees: offer.travelerOfferedPriceBeforeFees,
    datePriceFromAirbnb: offer.datePriceFromAirbnb,
    discount: totalSavings,
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
  travelerOfferedPriceBeforeFees,
  property,
  type,
}: {
  checkIn: Date;
  checkOut: Date;
  travelerOfferedPriceBeforeFees: number;
  numGuests: number;
  property: PropertyPageData;
  type: "bookItNow" | "requestToBook";
}): UnifiedCheckoutData {
  //first create the requestToBookPricing
  const pricing = {
    travelerOfferedPriceBeforeFees: travelerOfferedPriceBeforeFees,
    datePriceFromAirbnb: 0,
    discount: 0,
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
