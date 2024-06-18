import React, { ReactElement, SetStateAction, useEffect } from "react";
import stripe from "stripe";
import { useState } from "react";
import { api } from "@/utils/api";
import {
  ConnectComponentsProvider,
  ConnectPayments,
} from "@stripe/react-connect-js";
import { connect } from "http2";
import { Loader } from "lucide-react";
import Spinner from "../_common/Spinner";
import { env } from "@/env";
import {
  loadConnectAndInitialize,
  StripeConnectInstance,
} from "@stripe/connect-js";
import { set } from "lodash";

const StripeConnectSessionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  //we can get the stripe account id from the host profile
  const { data: stripeAccountIdNumber } =
    api.host.getStripeAccountId.useQuery();

  const [stripeAccountId, setStripeAccountId] = useState<{
    stripeAccountId: string | null;
  }>({ stripeAccountId: "" });

  const [accountIdReady, setAccountIdReady] = useState(false);

  useEffect(() => {
    if (!stripeAccountIdNumber) return;
    setStripeAccountId(stripeAccountIdNumber);
    console.log(stripeAccountId);
    setAccountIdReady(true);
  }, [stripeAccountIdNumber]);

  //we need to set the client secret as 1 time only
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance>();

  //to create a session using an exisint account
  const { data: accountSession } =
    api.stripe.createStripeAccountSession.useQuery(stripeAccountId, {
      enabled: accountIdReady,
      onSuccess: () => {
        console.log(accountSession);
        if (!accountSession) return;
        setStripeConnectInstance(
          loadConnectAndInitialize({
            // This is your test publishable API key.
            publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            fetchClientSecret: () =>
              Promise.resolve(accountSession!.client_secret),
            appearance: {
              // See all possible variables below
              overlays: "dialog",
              variables: {
                colorPrimary: "#FF0000",
              },
            },
            fonts: [
              {
                cssSrc:
                  "https://fonts.googleapis.com/css2?family=Mulish:wght@400;400italic;700;700italic&display=swap",
              },
            ],
          }),
        );
      },
    });

  return (
    <div>
      {children}
      {/* {stripeConnectInstance ? (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          {children}
        </ConnectComponentsProvider>
      ) : (
        children
      )} */}
    </div>
  );
};

export default StripeConnectSessionProvider;
