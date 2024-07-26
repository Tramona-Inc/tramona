import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import { formatDateRange, getNumNights } from "@/utils/utils";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { TAX_PERCENTAGE } from "@/utils/constants";
import type { OfferWithDetails } from "../offers/OfferPage";

interface StripeOptions {
  clientSecret?: string | null;
  fetchClientSecret?: (() => Promise<string>) | null;
  onComplete?: () => void;
}

const StripePaymentInfo = ({
  offer: { property, request, ...offer },
}: {
  offer: OfferWithDetails;
}) => {
  const stripePromise = useStripe();
  const cancelUrl = usePathname();
  const session = useSession({ required: true });

  const numNights = useMemo(
    () => getNumNights(offer.checkIn, offer.checkOut),
    [offer.checkIn, offer.checkOut],
  );
  const originalTotal = useMemo(
    () => property.originalNightlyPrice! * numNights,
    [property.originalNightlyPrice, numNights],
  );
  const tramonaServiceFee = offer.tramonaFee;

  const tax = useMemo(
    () => (offer.totalPrice + offer.tramonaFee) * TAX_PERCENTAGE,
    [offer.totalPrice, offer.tramonaFee],
  );
  const total = useMemo(
    () => offer.totalPrice + offer.tramonaFee + tax,
    [offer.totalPrice, offer.tramonaFee, tax],
  );

  const [options, setOptions] = useState<StripeOptions | null>(null);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const createCheckout = api.stripe.createCheckoutSession.useMutation();

  const fetchClientSecret = useCallback(async () => {
    if (!session.data?.user) return;
    try {
      const response = await createCheckout.mutateAsync({
        listingId: offer.id,
        propertyId: property.id,
        requestId: offer.requestId ?? null,
        name: property.name,
        price: total,
        tramonaServiceFee: tramonaServiceFee,
        description: "From: " + formatDateRange(offer.checkIn, offer.checkOut),
        cancelUrl: cancelUrl,
        images: property.imageUrls,
        totalSavings: originalTotal - (total + tax),
        phoneNumber: session.data.user.phoneNumber ?? "",
        userId: session.data.user.id,
        hostStripeId: property.host?.hostProfile?.stripeAccountId ?? "",
      });
      return response;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClientSecret();
        if (!response) {
          console.log("Not ready");
          return;
        }
        setOptions(response); // Set options directly within fetchData
        setCheckoutReady(true); // Set checkoutReady to true when options are set
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    };

    fetchData()
      .then(() => {
        console.log("we fetched client secret");
      })
      .catch((error) => {
        console.error("Error creating checkout session:", error);
      });
  }, []); // Re-run useEffect when fetchClientSecret changes

  return (
    <div id="checkout">
      {options && checkoutReady && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
          key={options.clientSecret}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
};

const MemoizedStripePaymentInfo = React.memo(StripePaymentInfo);
MemoizedStripePaymentInfo.displayName = "StripePaymentInfo";

export default MemoizedStripePaymentInfo;