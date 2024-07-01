import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import PaymentHistory from "@/components/host/finances/payment-history/PaymentHistory";
import FinancesSummary from "@/components/host/finances/summary/FinancesSummary";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  ConnectAccountOnboarding,
  ConnectNotificationBanner,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import Spinner from "@/components/_common/Spinner";

export default function Page() {
  useSession({ required: true });
  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();
  const { data: hostInfo } = api.host.getUserHostInfo.useQuery();

  const { mutate: createStripeConnectAccount } =
    api.stripe.createStripeConnectAccount.useMutation();

  const handleCreateStripeConnectAccount = useCallback(() => {
    if (!hostInfo?.stripeAccountId) {
      createStripeConnectAccount();
    }
  }, [hostInfo?.stripeAccountId, createStripeConnectAccount]);

  const [hostStripeAccountId, setHostStripeAccountId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (hostInfo?.stripeAccountId) {
      setHostStripeAccountId(hostInfo.stripeAccountId);
    }
  }, [hostInfo]);

  return (
    <DashboadLayout type={"host"}>
      <Head>
        <title>Host Finances | Tramona</title>
      </Head>

      <main className="container mb-24 flex w-11/12 flex-col gap-y-3">
        <h2 className="fond-extrabold ml-4 mt-7 text-left text-4xl">
          Finances
        </h2>
        {isStripeConnectInstanceReady && (
          <ConnectNotificationBanner
            collectionOptions={{
              fields: "eventually_due",
              futureRequirements: "include",
            }}
          />
        )}
        <Tabs defaultValue="summary" className="space-y-10">
          <TabsList className="text-blue-200">
            <TabsTrigger
              className="data-[state=active]:border-primaryGreen data-[state=active]:text-primaryGreen data-[state=inactive]:text-zinc-400"
              value="summary"
            >
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="paymentHistory"
              className="text-primaryGreen data-[state=active]:border-primaryGreen data-[state=inactive]:text-zinc-400"
            >
              Payment History
            </TabsTrigger>
            <TabsTrigger
              value="Settings"
              className="text-primaryGreen data-[state=active]:border-primaryGreen data-[state=inactive]:text-zinc-400"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <FinancesSummary
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
          <TabsContent value="Settings">
            <div className="flex justify-around">
              {hostInfo?.stripeAccountId && hostInfo?.chargesEnabled ? (
                isStripeConnectInstanceReady ? (
                  <div className="relative my-3 flex w-full flex-row items-center justify-around gap-x-10">
                    <ConnectAccountManagement
                      collectionOptions={{
                        fields: "eventually_due",
                        futureRequirements: "include",
                      }}
                    />
                  </div>
                ) : (
                  <Spinner />
                )
              ) : (
                <div className="flex flex-col items-center">
                  {!hostInfo?.stripeAccountId && (
                    <Button onClick={handleCreateStripeConnectAccount}>
                      Create Stripe Account
                    </Button>
                  )}
                  {isStripeConnectInstanceReady && (
                    <ConnectAccountOnboarding
                      onExit={() => {
                        console.log("onExit");
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </DashboadLayout>
  );
}
