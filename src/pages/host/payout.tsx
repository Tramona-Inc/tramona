import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import SpinnerButton from "@/components/_icons/SpinnerButton";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { useEffect, useState } from "react";
import { RouterOutputs } from "@/utils/api";
import {
  ConnectPayments,
  ConnectAccountOnboarding,
  ConnectNotificationBanner,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import Spinner from "@/components/_common/Spinner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export type StripeConnectAccountAndURl =
  RouterOutputs["stripe"]["createStripeConnectAccount"];

export default function Payout() {
  useSession({ required: true });
  //get the accound Id from the store
  const { isStripeConnectInstanceReady, setStripeConnectInstanceReady } =
    useIsStripeConnectInstanceReady();

  const { data: hostInfo } = api.host.getUserHostInfo.useQuery();
  const utils = api.useUtils();

  //we have create an account
  const {
    data,
    mutate: createStripeConnectAccount,
    isLoading,
  } = api.stripe.createStripeConnectAccount.useMutation({
    onSuccess: () => {
      void utils.invalidate();
    },
  });

  //Now create a link (a new link is created everysession reguardless of account)
  const { data: accountLink } = api.stripe.createStripeAccountLink.useQuery(
    hostInfo?.stripeAccountId!,
  );

  //setting the client
  //setStripeConnectInstance(data?.stripeAccount);
  function handleOnClick() {
    void createStripeConnectAccount();
  }

  //useEffect to keep track of the account id state
  useEffect(() => {
    console.log("isStripeConnectInstanceReady", isStripeConnectInstanceReady);
  }, [isStripeConnectInstanceReady]);

  return (
    <DashboadLayout type={"host"}>
      <Head>
        <title>Host Payout | Tramona</title>
      </Head>

      <main className="container flex h-screen flex-col items-center justify-around">
        <h2 className="fond-bold text-4xl">Payout</h2>
        {/* We are going to break this into two states  
        1. Host has an exising stripeAcont + isAccountIdReady loading State
        2. Host Does not have an existing stripe account and needs to make one + plus loading state 
        <ConnnectPayments is needs isAccountIdRead true otherewise there will be an error
        */}
        {hostInfo?.stripeAccountId && (
          <div className="flex justify-around">
            {isStripeConnectInstanceReady ? (
              <div className="relative my-3 flex w-full flex-row items-center justify-around gap-x-10">
                <ConnectNotificationBanner
                // Optional:
                // collectionOptions={{
                //   fields: 'eventually_due',
                //   futureRequirements: 'include',
                // }}
                />
                <ConnectAccountManagement
                // Optional:
                // collectionOptions={{
                //   fields: 'eventually_due',
                //   futureRequirements: 'include',
                // }}
                />
                <ConnectPayments />
                <Dialog>
                  <DialogTrigger>
                    <Button>Connect Account Onboarding</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ConnectAccountOnboarding
                      onExit={() => {
                        console.log("The account has exited onboarding");
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <Spinner />
            )}
          </div>
        )}
        {accountLink ? (
          <Button>
            {" "}
            <Link href={accountLink}>Connect</Link>{" "}
          </Button>
        ) : (
          <div className="flex flex-col items-center">
            <h2>Stripe account not connected yet!</h2>
            <Button disabled={isLoading} onClick={handleOnClick}>
              {isLoading && <SpinnerButton />}
              Stripe connect
            </Button>
          </div>
        )}
      </main>
    </DashboadLayout>
  );
}
