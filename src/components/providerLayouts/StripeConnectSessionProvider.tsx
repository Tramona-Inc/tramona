import {
  type ReactElement,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
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
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance>();
  const { isStripeConnectInstanceReady, setStripeConnectInstanceReady } =
    useIsStripeConnectInstanceReady();
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

  // Memoize the creation of the Stripe Connect instance
  const createStripeInstance = useCallback(async (clientSecret: string) => {
    try {
      const instance = loadConnectAndInitialize({
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
        fonts: [
          //have to figure out cors issue before adding mullish font
          // {
          //   cssSrc:
          //     "https://fonts.googleapis.com/css2?family=Mulish:wght@400;400italic;700;700italic&display=swap",
          // },
        ],
      });
      setStripeConnectInstance(instance);
    } catch (error) {
      console.error("Failed to initialize Stripe Connect:", error);
    }
  }, []);

  // Fetch the account session only when stripeConnectId is available and we have not created a session yet
  const { data: accountSession } =
    api.stripe.createStripeAccountSession.useQuery(
      stripeConnectIdRef.current!,
      {
        enabled: !!stripeConnectIdRef.current && !sessionCreatedRef.current,
        onSuccess: (data) => {
          if (!data) return;
          void createStripeInstance(data.client_secret);
          sessionCreatedRef.current = true;
        },
      },
    );

  // Set isStripeConnectInstanceReady only once stripeConnectInstance is available and is different
  useEffect(() => {
    if (stripeConnectInstance && !isStripeConnectInstanceReady) {
      setStripeConnectInstanceReady(true);
    }
  }, [
    stripeConnectInstance,
    setStripeConnectInstanceReady,
    isStripeConnectInstanceReady,
  ]);

  //Memoize the Provider, this prevents rerenders if the stripeInstance has not changed.
  const MemoizedConnectComponentsProvider = useMemo(
    () =>
      stripeConnectInstance ? (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          {children}
        </ConnectComponentsProvider>
      ) : (
        children
      ),
    [stripeConnectInstance, children],
  );

  return <>{MemoizedConnectComponentsProvider}</>;
};

export default StripeConnectSessionProvider;
