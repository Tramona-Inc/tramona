import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import PaymentHistory from "@/components/host/finances/payment-history/PaymentHistory";
import FinancesSummary from "@/components/host/finances/summary/FinancesSummary";
import NoStripeAccount from "@/components/host/finances/NoStripeAccount";
import {
  ConnectAccountOnboarding,
  ConnectNotificationBanner,
  ConnectAccountManagement,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import FinanceLoading from "./_components/FinanceLoading";
import StripeConnectCurrentlyDueBeforePayouts from "@/components/host/finances/StripeConnectCurrentlyDueBeforePayout";
import SettingsAndDocuments from "./_components/SettingAndDocuments";
import { SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { data: user } = api.users.getUser.useQuery();
  const { data: hostInfo } = api.host.getUserHostInfo.useQuery();
  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();
  const [hostStripeConnectId, setHostStripeConnectId] = useState<string>("");
  const trimmedConnectId = user?.stripeConnectId
    ? user.stripeConnectId.slice(5)
    : "0"; //needs a connectID

  const settingsItems = [
    {
      title: "Payout settings",
      href: `/host/finances/settings/${trimmedConnectId}`,
    },
    {
      title: "Payment History",
      href: `/host/finances/payment-history/${trimmedConnectId}`,
    },
    {
      title: "Tax information",
      href: `/host/finances/taxes/${trimmedConnectId}`,
    },
  ];

  const { data: stripeAccount, isLoading: stripeLoading } =
    api.stripe.retrieveStripeConnectAccount.useQuery(hostStripeConnectId, {
      enabled: !!user?.stripeConnectId,
    });

  useSession({ required: true });

  if (user?.stripeConnectId && !hostStripeConnectId) {
    setHostStripeConnectId(user.stripeConnectId);
  }

  return (
    <DashboadLayout>
      <Head>
        <title>Host Finances | Tramona</title>
      </Head>

      <main className="container mb-24 flex w-11/12 flex-col gap-y-3">
        <div className="flex flex-row items-end justify-between">
          <h2 className="fond-black ml-4 mt-7 text-left text-4xl tracking-tight">
            Finances
          </h2>
          <Button size="icon" variant="ghost">
            <Link href="host/finance/settings">
              <SettingsIcon size={25} />
            </Link>
          </Button>
        </div>

        {isStripeConnectInstanceReady && (
          <ConnectNotificationBanner
            collectionOptions={{
              fields: "eventually_due",
              futureRequirements: "include",
            }}
          />
        )}

        {isStripeConnectInstanceReady ? (
          stripeLoading ? (
            <div>Loading Stripe account details...</div>
          ) : (
            <div className="flex flex-col gap-y-3">
              {stripeAccount?.requirements?.currently_due &&
                stripeAccount.requirements.currently_due.length > 1 && (
                  <StripeConnectCurrentlyDueBeforePayouts />
                )}

              <FinancesSummary
                hostStripeConnectId={hostStripeConnectId}
                isStripeConnectInstanceReady={isStripeConnectInstanceReady}
                becameHostAt={hostInfo?.becameHostAt}
              />
              <SettingsAndDocuments items={settingsItems} />
              <PaymentHistory />
            </div>
          )
        ) : (
          <FinanceLoading />
        )}
      </main>
    </DashboadLayout>
  );
}
``;
