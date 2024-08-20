import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import PaymentHistory from "@/components/host/finances/payment-history/PaymentHistory";
import FinancesSummary from "@/components/host/finances/summary/FinancesSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useCallback, useEffect, useRef, useState } from "react";
import NoStripeAccount from "@/components/host/finances/NoStripeAccount";
import {
  ConnectAccountOnboarding,
  ConnectNotificationBanner,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import Spinner from "@/components/_common/Spinner";
import { stripe } from "@/server/api/routers/stripeRouter";

export default function Page() {
  useSession({ required: true });
  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();
  const { data: hostInfo, isLoading: isHostInfoLoading } =
    api.host.getUserHostInfo.useQuery();

  const [hostStripeAccountId, setHostStripeAccountId] = useState<string | null>(
    null,
  );

  const stripeStateChangeCount = useRef(0);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (isStripeConnectInstanceReady === true) {
      setIsPageLoading(false);
    } else {
      stripeStateChangeCount.current += 1;
      // stripe connect instance initializes to false
      if (stripeStateChangeCount.current >= 2) {
        setIsPageLoading(false);
      }
    }
  }, [isStripeConnectInstanceReady]);

  useEffect(() => {
    if (hostInfo?.stripeAccountId) {
      setHostStripeAccountId(hostInfo.stripeAccountId);
    }
  }, [hostInfo]);

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
        {isPageLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Spinner />
          </div>
        ) : isStripeConnectInstanceReady ? (
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
                {hostInfo?.stripeAccountId && hostInfo.chargesEnabled ? (
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
                  <div className="flex flex-col items-center justify-center">
                    {!hostInfo?.stripeAccountId && <NoStripeAccount />}
                    {isStripeConnectInstanceReady && (
                      <ConnectAccountOnboarding
                        onExit={() => {
                          window.location.reload(); //default behavior we should change if ugly
                        }}
                      />
                    )}
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
