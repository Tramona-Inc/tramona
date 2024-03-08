import { env } from "@/env";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useMemo } from "react";
import { type OfferWithProperty } from ".";
import AirbnbDialog from "./AirbnbBookDialog";
import DirectBookDialog from "./DirectBookDialog";

export const useStripe = () => {
  const stripe = useMemo<Promise<Stripe | null>>(
    () => loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    [],
  );

  return stripe;
};

export default function HowToBookDialog(
  props: React.PropsWithChildren<{
    isBooked: boolean;
    listingId: number;
    totalPrice: number;
    offerNightlyPrice: number;
    originalNightlyPrice: number;
    propertyName: string;
    airbnbUrl: string;
    checkIn: Date;
    checkOut: Date;
    offer: OfferWithProperty;
    requestId: number;
    isAirbnb: boolean;
  }>,
) {
  const {
    isBooked,
    offer,
    propertyName,
    originalNightlyPrice,
    airbnbUrl,
    checkIn,
    checkOut,
    requestId,
    offerNightlyPrice,
    isAirbnb,
  } = props;

  return isAirbnb ? (
    <AirbnbDialog
      isBooked={isBooked}
      listingId={offer.id}
      propertyName={propertyName}
      originalNightlyPrice={originalNightlyPrice}
      airbnbUrl={airbnbUrl ?? ""}
      checkIn={checkIn}
      checkOut={checkOut}
      requestId={requestId}
      offer={offer}
      totalPrice={offer.totalPrice}
      offerNightlyPrice={offerNightlyPrice}
    >
      {props.children}
    </AirbnbDialog>
  ) : (
    <DirectBookDialog
      isBooked={isBooked}
      listingId={offer.id}
      propertyName={propertyName}
      originalNightlyPrice={originalNightlyPrice}
      airbnbUrl={airbnbUrl ?? ""}
      checkIn={checkIn}
      checkOut={checkOut}
      requestId={requestId}
      offer={offer}
      totalPrice={offer.totalPrice}
      offerNightlyPrice={offerNightlyPrice}
    >
      {props.children}
    </DirectBookDialog>
  );
}
