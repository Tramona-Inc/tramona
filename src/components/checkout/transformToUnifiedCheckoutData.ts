import { breakdownPaymentByOffer } from "@/utils/payment-utils/paymentBreakdown";
import { UnifiedCheckoutData } from "./types";
import { RouterOutputs } from "@/utils/api";
import { PropertyPageData } from "../propertyPages/PropertyPage";
import { getApplicableBookItNowAndRequestToBookDiscountPercentage } from "@/utils/utils";

type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];

export function offerToUnifiedCheckout({
  offer,
}: {
  offer: OfferWithDetails;
}): UnifiedCheckoutData {
  const { totalSavings } = breakdownPaymentByOffer(offer);

  //first create the requestToBookPricing
  const pricing = {
    travelerOfferedPrice: offer.travelerOfferedPrice,
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
  travelerOfferedPrice,
  property,
  type,
}: {
  checkIn: Date;
  checkOut: Date;
  travelerOfferedPrice: number;
  numGuests: number;
  property: PropertyPageData;
  type: "bookItNow" | "requestToBook";
}): UnifiedCheckoutData {
  //first create the requestToBookPricing
  const pricing = {
    travelerOfferedPrice: travelerOfferedPrice,
    datePriceFromAirbnb: 0,
    discount:
      getApplicableBookItNowAndRequestToBookDiscountPercentage(property),
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
