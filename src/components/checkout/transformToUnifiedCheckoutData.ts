import { breakdownPaymentByOffer } from "@/utils/payment-utils/paymentBreakdown";
import { UnifiedCheckoutData } from "./types";
import { RouterOutputs } from "@/utils/api";

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
    type: "Offer",
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
