import DashboadLayout from "@/components/_common/Layout/DashboardLayout";

import EarningsDashboard from "@/components/host/finances/EarningsDashboard";
import PaymentHistory from "@/components/host/finances/payment-history/PaymentHistory";
import SpinnerButton from "@/components/_icons/SpinnerButton";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { useEffect, useState } from "react";
import type { RouterOutputs } from "@/utils/api";
import {
  ConnectAccountOnboarding,
  ConnectNotificationBanner,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import Spinner from "@/components/_common/Spinner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import FinanceSummary from "@/components/host/finances/FinancesSummary";
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
  const { mutate: createStripeConnectAccount, isLoading } =
    api.stripe.createStripeConnectAccount.useMutation({
      onSuccess: () => {
        void utils.invalidate();
      },
    });

  //Now create a link (a new link is created every session reguardless of account)
  //we dont want to call it if accont link does not exist
  const [hostStripeAccountId, setHostStripeAccountId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (hostInfo?.stripeAccountId) {
      setHostStripeAccountId(hostInfo.stripeAccountId);
    }
  }, [hostInfo]);

  const { data: accountLink } = api.stripe.createStripeAccountLink.useQuery(
    hostStripeAccountId!,
    {
      enabled: !!hostStripeAccountId,
    },
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
        <title>Host Finances | Tramona</title>
      </Head>

      <main className="container flex h-screen w-11/12 flex-col gap-y-3">
        <h2 className="fond-extrabold ml-4 mt-7 text-left text-4xl">
          Finances
        </h2>
        {/* We are going to break this into two states  
        1. Host has an exising stripeAcont + isAccountIdReady loading State
        2. Host Does not have an existing stripe account and needs to make one + plus loading state 
        <ConnnectPayments is needs isAccountIdRead true otherewise there will be an error
        */}
        {isStripeConnectInstanceReady && (
          <ConnectNotificationBanner
            collectionOptions={{
              fields: "eventually_due",
              futureRequirements: "include",
            }}
          />
        )}
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="paymentHistory">Payment History</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="Settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <FinanceSummary
              hostStripeAccountId={hostStripeAccountId}
              isStripeConnectInstanceReady={isStripeConnectInstanceReady}
              becameHostAt={hostInfo?.becameHostAt}
            />
          </TabsContent>
          <TabsContent value="paymentHistory">
            <PaymentHistory
              hostStripeAccountId={hostStripeAccountId}
              isStripeConnectInstanceReady={isStripeConnectInstanceReady}
            />
          </TabsContent>
          <TabsContent value="properties">
            <EarningsDashboard />
          </TabsContent>
          <TabsContent value="Settings">
            {hostInfo?.stripeAccountId && (
              <div className="flex justify-around">
                {isStripeConnectInstanceReady ? (
                  <div className="relative my-3 flex w-full flex-row items-center justify-around gap-x-10">
                    <ConnectAccountManagement
                      collectionOptions={{
                        fields: "eventually_due",
                        futureRequirements: "include",
                      }}
                    />

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
          </TabsContent>
        </Tabs>
      </main>
    </DashboadLayout>
  );
}
