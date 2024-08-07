import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import { formatDateRange, getNumNights, getPriceBreakdown } from "@/utils/utils";
import StripeCheckoutForm from "./StripeCheckoutForm";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { TAX_PERCENTAGE, SUPERHOG_FEE } from "@/utils/constants";
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

  const { serviceFee, finalTotal } = useMemo(
    () => getPriceBreakdown(offer.totalPrice, numNights, SUPERHOG_FEE, TAX_PERCENTAGE),
    [offer.totalPrice, numNights]
  );
  
  const [options, setOptions] = useState<StripeElementsOptions | undefined>(
    undefined,
  );
  const [paymentIntentResponse, setPaymentIntentResponse] =
    useState<Stripe.Response<Stripe.PaymentIntent> | null>(null);
  const [checkoutReady, setCheckoutReady] = useState(false);
  const authorizePayment = api.stripe.authorizePayment.useMutation();

  const fetchClientSecret = useCallback(async () => {
    if (!session.data?.user) return;
    try {
      const response = await authorizePayment.mutateAsync({
        offerId: offer.id,
        propertyId: property.id,
        requestId: offer.requestId ?? null,
        name: property.name,
        price: finalTotal,
        tramonaServiceFee: serviceFee,
        description: "From: " + formatDateRange(offer.checkIn, offer.checkOut),
        cancelUrl: cancelUrl,
        images: property.imageUrls,
        // totalSavings: originalTotal - (total + tax), <-- check math on this
        totalSavings: originalTotal - finalTotal,
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
          clientSecret: response.client_secret!, //#004236 #f4f4f5
          appearance: {
            theme: "stripe",
            variables: {
              gridRowSpacing: "20px",
              tabSpacing: "10px",
              fontFamily: ' "Gill Sans", sans-serif',
              fontLineHeight: "1.5",
              borderRadius: "10px",
              colorBackground: "#f4f4f5",
              iconColor: "#004236",
              tabIconSelectedColor: "#004236",
              accessibleColorOnColorPrimary: "#004236",
              //tabLogoColor: "#004236",
            },
            rules: {
              ".Block": {
                backgroundColor: "var(--colorBackground)",
                boxShadow: "none",
                padding: "12px",
              },
              ".Input": {
                padding: "12px",
                backgroundColor: "#00000000",
              },
              ".Input:disabled, .Input--invalid:disabled": {
                color: "lightgray",
              },
              ".Tab": {
                padding: "10px 12px 8px 12px",
                border: "none",
                textColors: "#004236",
              },
              ".Tab:hover": {
                border: "none",
                boxShadow:
                  "0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
              },
              ".Tab--selected, .Tab--selected:focus, .Tab--selected:hover": {
                border: "none",
                backgroundColor: "#fff",
                color: "#004236",
                fontWeight: "500",
                boxShadow:
                  "0 0 0 1.5px var(--colorPrimaryText), 0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 7px rgba(18, 42, 66, 0.04)",
                textColors: "#004236",
              },
              ".Label": {
                fontWeight: "500",
                textColors: "#004236",
                color: "#004236",
              },
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
  }, []); // For some reason, I am getting a rerender

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
