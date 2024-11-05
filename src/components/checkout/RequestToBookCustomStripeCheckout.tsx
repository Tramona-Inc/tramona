import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import StripeCheckoutForm from "./StripeCheckoutForm";
import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type {
  RequestToBookDetails,
} from "../offers/PropertyPage";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import Spinner from "../_common/Spinner";
import { useToast } from "../ui/use-toast";
import { Property } from "@/server/db/schema";
import { RequestToBookPricing } from "./RequestToBookCheckout";

const RequestToBookCustomStripeCheckout = ({
  property,
  requestToBook,
  requestToBookPricing,
}: {
  property: Property;
  requestToBook: RequestToBookDetails;
  requestToBookPricing: RequestToBookPricing
}) => {
  const { toast } = useToast();
  const stripePromise = useStripe();
  const { pathname } = useRouter();
  const session = useSession({ required: true });

  const [options, setOptions] = useState<StripeElementsOptions | undefined>(
    undefined,
  );
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authorizePayment = api.stripe.authorizePayment.useMutation();

  const { data: hostTeamOwner, isLoading: isHostTeamLoading } =
    api.hostTeams.getHostTeamOwner.useQuery(
      {
        hostTeamId: property.hostTeamId!,
      },
      {
        retry: false,
        enabled: !!property.hostTeamId,
      },
    );

  const fetchClientSecret = useCallback(async () => {
    if (!session.data?.user) {
      console.error("Missing required data for payment");
      return;
    }

    if (!hostTeamOwner || "code" in hostTeamOwner) {
      console.error("No valid host team data found");
      return;
    }

    if (!hostTeamOwner.stripeConnectId) {
      console.error("No stripe connect ID found for host");
      return;
    }


    try {
      const propertyWithHostTeam = {
        ...property,
        hostTeam: {
          owner: {
            stripeConnectId: hostTeamOwner.stripeConnectId,
          },
        },
      };

      const response = await authorizePayment.mutateAsync({
        offerId: -1,
        cancelUrl: pathname,
        requestToBookPricing: {
          ...requestToBookPricing,
          property: propertyWithHostTeam,
        },
      });
      return response;
    } catch (error) {
      toast({
        title: "Error creating checkout session",
        variant: "destructive",
      });
    }
  }, [
    session.data?.user,
    hostTeamOwner,
    property,
    authorizePayment,
    requestToBookPricing,
    pathname,
    toast,
  ]);

  useEffect(() => {
    if (!hostTeamOwner || checkoutReady || isLoading) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchClientSecret();
        if (!response) {
          return;
        }

        setOptions({
          clientSecret: response.client_secret!,
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
        setCheckoutReady(true);
      } catch (error) {
        console.error("Error creating checkout session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <div className="w-full">
      {checkoutReady && options?.clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <StripeCheckoutForm
            originalListingPlatform={property.originalListingPlatform}
          />
        </Elements>
      ) : (
        <div className="h-48">
          <Spinner />
        </div>
      )}
    </div>
  );
};

const MemoizedCustomStripeCheckout = React.memo(
  RequestToBookCustomStripeCheckout,
);
MemoizedCustomStripeCheckout.displayName = "RequestToBookCustomStripeCheckout";

export default MemoizedCustomStripeCheckout;
