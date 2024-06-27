import React, { type ReactElement, useEffect } from "react";

import { useState } from "react";
import { api } from "@/utils/api";
import { ConnectComponentsProvider } from "@stripe/react-connect-js";

import { env } from "@/env";
import {
  loadConnectAndInitialize,
  type StripeConnectInstance,
} from "@stripe/connect-js";

import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";

//we need to use zustand, so when the the instance for the provider is ready, we can use it in the children

const StripeConnectSessionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  //we can get the stripe account id from the host profile
  const { data: stripeAccountIdNumber } =
    api.host.getStripeAccountId.useQuery();

  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);

  //this wets the stripeACCOUNTID number that will be used to create a session
  useEffect(() => {
    if (!stripeAccountIdNumber) return;
    setStripeAccountId(stripeAccountIdNumber.stripeAccountId);
    console.log("stripeAccoutneI after set");
    console.log(stripeAccountIdNumber.stripeAccountId);
  }, [stripeAccountIdNumber]);

  //we need to set the client secret as 1 time only
  const [stripeConnectInstance, setStripeConnectInstance] =
    useState<StripeConnectInstance>();

  //we need to set the accountIDReadty
  const { isStripeConnectInstanceReady, setStripeConnectInstanceReady } =
    useIsStripeConnectInstanceReady();
  //create and effect to set to true when the stripeConnectInstance is ready
  //to create a session using an exisint account
  useEffect(() => {
    if (stripeConnectInstance) {
      setStripeConnectInstanceReady(true);
      console.log("Set id was set to ture");
    }
  }, [stripeConnectInstance, setStripeConnectInstanceReady]);

  const { data: accountSession } =
    api.stripe.createStripeAccountSession.useQuery(stripeAccountId!, {
      enabled: stripeAccountId ? true : false,
      onSuccess: () => {
        console.log("accountSession before return ");
        if (!accountSession) return;
        console.log(
          "accountSession after return ",
          isStripeConnectInstanceReady,
        );

        setStripeConnectInstance(
          loadConnectAndInitialize({
            // This is your test publishable API key.
            publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
            fetchClientSecret: () =>
              Promise.resolve(accountSession.client_secret),
            appearance: {
              // See all possible variables below
              overlays: "dialog",
              variables: {
                colorPrimary: "#134E4A",
                buttonPrimaryColorBackground: "#134E4A",
                fontFamily: "Helvetica Neue",
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
      {stripeConnectInstance ? (
        <ConnectComponentsProvider connectInstance={stripeConnectInstance}>
          {children}
        </ConnectComponentsProvider>
      ) : (
        <div> {children} </div>
      )}
    </div>
  );
};

export default StripeConnectSessionProvider;
