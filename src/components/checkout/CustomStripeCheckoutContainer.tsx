import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import StripeCheckoutForm from "./StripeCheckoutForm";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import Spinner from "../_common/Spinner";
import { useToast } from "../ui/use-toast";
import { UnifiedCheckoutData } from "./types";
import { breakdownPaymentByPropertyAndTripParams } from "@/utils/payment-utils/paymentBreakdown";

const CustomStripeCheckoutContainer = ({
  unifiedCheckoutData,
}: {
  unifiedCheckoutData: UnifiedCheckoutData;
}) => {
  const { toast } = useToast();
  const stripePromise = useStripe();
  const { pathname } = useRouter();

  const [options, setOptions] = useState<StripeElementsOptions | undefined>(
    undefined,
  );
  const [checkoutReady, setCheckoutReady] = useState(false);

  const authorizePayment = api.stripe.authorizePayment.useMutation();
  const fetchClientSecret = useCallback(async () => {
    try {
      const { totalTripAmount } = breakdownPaymentByPropertyAndTripParams({
        dates: {
          checkIn: unifiedCheckoutData.dates.checkIn,
          checkOut: unifiedCheckoutData.dates.checkOut,
        },
        calculatedTravelerPrice:
          unifiedCheckoutData.pricing.calculatedTravelerPrice,
        property: unifiedCheckoutData.property,
      });

      return await authorizePayment.mutateAsync({
        totalAmountPaid: totalTripAmount!,
        calculatedTravelerPrice:
          unifiedCheckoutData.pricing.calculatedTravelerPrice,
        additionalFees: unifiedCheckoutData.pricing.additionalFees,
        cancelUrl: pathname,
        propertyId: unifiedCheckoutData.property.id,
        offerId: unifiedCheckoutData.offerId ?? null,
        scrapeUrl: unifiedCheckoutData.scrapeUrl,

        datePriceFromAirbnb: unifiedCheckoutData.pricing.datePriceFromAirbnb,
        requestPercentageOff: unifiedCheckoutData.pricing.requestPercentageOff,
        checkIn: unifiedCheckoutData.dates.checkIn,
        checkOut: unifiedCheckoutData.dates.checkOut,
        type: unifiedCheckoutData.type,
        numOfGuests: unifiedCheckoutData.guests,
      });
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
          return;
        }

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

    fetchData().catch((error) => {
      console.error("Error creating checkout session:", error);
    });
  }, []); // For some reason, I am getting a rerender

  return (
    <div className="w-full">
      {checkoutReady && options?.clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <StripeCheckoutForm unifiedCheckoutData={unifiedCheckoutData} />
        </Elements>
      ) : (
        <div className="h-48">
          <Spinner />
        </div>
      )}
    </div>
  );
};

const MemoizedCustomStripeCheckoutContainer = React.memo(
  CustomStripeCheckoutContainer,
);
MemoizedCustomStripeCheckoutContainer.displayName =
  "CustomStripeCheckoutContainer";

export default MemoizedCustomStripeCheckoutContainer;
