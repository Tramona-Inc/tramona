import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import PaymentHistory from "@/components/host/finances/payment-history/PaymentHistory";
import FinancesSummary from "@/components/host/finances/summary/FinancesSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import NoStripeAccount from "@/components/host/finances/NoStripeAccount";
import {
  ConnectAccountOnboarding,
  ConnectNotificationBanner,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";

export default function Page() {
  useSession({ required: true });
  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();
  const { data: hostInfo } = api.host.getUserHostInfo.useQuery();
  const { data: user } = api.users.getUser.useQuery();

  const [hostStripeConnectId, sethostStripeConnectId] = useState<string | null>(
    null,
  );

  const stripeStateChangeCount = useRef(0);

  useEffect(() => {
    if (isStripeConnectInstanceReady === true) {
    } else {
      stripeStateChangeCount.current += 1;
      // stripe connect instance initializes to false
      if (stripeStateChangeCount.current >= 2) {
      }
    }
  }, [isStripeConnectInstanceReady]);

  useEffect(() => {
    if (user?.stripeConnectId) {
      sethostStripeConnectId(user.stripeConnectId);
    }
  }, [user]);

  return (
    <DashboadLayout>
      <Head>
        <title>Host Finances | Tramona</title>
      </Head>

      <main className="container mb-24 flex w-11/12 flex-col gap-y-3">
        <h2 className="fond-black ml-4 mt-7 text-left text-4xl tracking-tight">
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
        {isStripeConnectInstanceReady ? (
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
                hostStripeConnectId={hostStripeConnectId}
                isStripeConnectInstanceReady={isStripeConnectInstanceReady}
                becameHostAt={hostInfo?.becameHostAt}
              />
            </TabsContent>
            <TabsContent value="paymentHistory">
              <PaymentHistory />
            </TabsContent>
            <TabsContent value="Settings">
              <div className="flex justify-around">
                {user?.stripeConnectId && user.chargesEnabled ? (
                  <div className="relative my-3 flex w-full flex-row items-center justify-around gap-x-10">
                    <ConnectAccountManagement
                      collectionOptions={{
                        fields: "eventually_due",
                        futureRequirements: "include",
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    {!user?.stripeConnectId && <NoStripeAccount />}
                    <ConnectAccountOnboarding
                      onExit={() => {
                        window.location.reload(); //default behavior we should change if ugly
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <NoStripeAccount />
        )}
      </main>
    </DashboadLayout>
  );
}
