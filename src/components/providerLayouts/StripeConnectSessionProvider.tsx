import { type ReactElement, useEffect, useCallback, useRef } from "react";
import { api } from "@/utils/api";
import { ConnectComponentsProvider } from "@stripe/react-connect-js";
import { env } from "@/env";
import {
  loadConnectAndInitialize,
  type StripeConnectInstance,
} from "@stripe/connect-js/pure";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";

const StripeConnectSessionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const { data: user } = api.users.getUser.useQuery();
  const stripeConnectIdRef = useRef<string | null>(null);
  const stripeConnectInstanceRef = useRef<StripeConnectInstance | null>(null);
  const { setStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();
  const sessionCreatedRef = useRef(false);

  // Set stripeConnectId in ref only when it changes
  useEffect(() => {
    if (
      !user?.stripeConnectId ||
      user.stripeConnectId === stripeConnectIdRef.current
    )
      return;
    stripeConnectIdRef.current = user.stripeConnectId;
  }, [user]);

  // Create Stripe instance without causing rerenders
  const createStripeInstance = useCallback(
    async (clientSecret: string) => {
      try {
        const instance = await loadConnectAndInitialize({
          publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          fetchClientSecret: () => Promise.resolve(clientSecret),
          appearance: {
            overlays: "dialog",
            variables: {
              colorPrimary: "#134E4A",
              buttonPrimaryColorBackground: "#134E4A",
              fontFamily: "Helvetica Neue",
            },
          },
          fonts: [],
        });

        // Update the ref without causing a rerender
        stripeConnectInstanceRef.current = instance;
        setStripeConnectInstanceReady(true);
      } catch (error) {
        console.error("Failed to initialize Stripe Connect:", error);
      }
    },
    [setStripeConnectInstanceReady],
  );

  // Fetch the account session only when stripeConnectId is available
  api.stripe.createStripeAccountSession.useQuery(stripeConnectIdRef.current!, {
    enabled: !!stripeConnectIdRef.current && !sessionCreatedRef.current,
    onSuccess: (data) => {
      if (!data) return;
      void createStripeInstance(data.client_secret);
      sessionCreatedRef.current = true;
    },
  });

  // Initialize provider immediately with null instance
  return (
    <ConnectComponentsProvider
      connectInstance={stripeConnectInstanceRef.current!}
    >
      {children}
    </ConnectComponentsProvider>
  );
};

export default StripeConnectSessionProvider;
