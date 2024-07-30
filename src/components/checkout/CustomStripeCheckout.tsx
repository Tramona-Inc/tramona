import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import { formatDateRange, getNumNights } from "@/utils/utils";
import StripeCheckoutForm from "./StripeCheckoutForm";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { TAX_PERCENTAGE } from "@/utils/constants";
import type { OfferWithDetails } from "../offers/OfferPage";
import type { Stripe } from "stripe";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import Spinner from "../_common/Spinner";

import { useToast } from "../ui/use-toast";

const CustomStripeCheckout = ({
  offer: { property, request, ...offer },
}: {
  offer: OfferWithDetails;
}) => {
  const { toast } = useToast();
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

  const [options, setOptions] = useState<StripeElementsOptions | undefined>(
    undefined,
  );
  const [paymentIntentResponse, setPaymentIntentResponse] =
    useState<Stripe.Response<Stripe.PaymentIntent> | null>(null);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const createPaymentIntent = api.stripe.createPaymentIntent.useMutation();

  const fetchClientSecret = useCallback(async () => {
    if (!session.data?.user) return;
    try {
      const response = await createPaymentIntent.mutateAsync({
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
      toast({
        title: "Error creating checkout session",
        variant: "destructive",
      });
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
        setPaymentIntentResponse(response); // Set PaymentIntentResponse directly within fetchData then we convert to options ]
        setOptions({
          clientSecret: response.client_secret!,
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#004236",
              colorText: "#004236",

              spacingUnit: "4px",
            },
          },
        });
        setCheckoutReady(true); // Set checkoutReady to true when options are set
      } catch (error) {
        console.error("Error creating checkout session:", error);
      }
    };

    fetchData()
      .then(() => {
        console.log(
          "we fetched client secret",
          paymentIntentResponse?.client_secret,
        );
      })
      .catch((error) => {
        console.error("Error creating checkout session:", error);
      });
  }, []); // Re-run useEffect when fetchClientSecret changes

  return (
    <div className="w-full">
      {checkoutReady && options?.clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <StripeCheckoutForm clientSecret={options.clientSecret} />
        </Elements>
      ) : (
        <div className="h-48">
          <Spinner />
        </div>
      )}
    </div>
  );
};

const MemoizedCustomStripeCheckout = React.memo(CustomStripeCheckout);
MemoizedCustomStripeCheckout.displayName = "CustomStripeCheckout";

export default MemoizedCustomStripeCheckout;
