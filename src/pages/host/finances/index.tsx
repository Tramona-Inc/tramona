import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import FinancesSummary from "@/components/host/finances/summary/FinancesSummary";
import { ConnectNotificationBanner } from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import FinanceLoading from "../../../components/host/finances/common/FinanceLoading";
import StripeConnectCurrentlyDueBeforePayouts from "@/components/host/finances/StripeConnectCurrentlyDueBeforePayout";
import SettingsAndDocuments from "../../../components/host/finances/SettingAndDocuments";
import { SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { data: user } = api.users.getUser.useQuery();
  const { data: hostProfile } = api.hosts.getMyHostProfile.useQuery();
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

      <main className="mx-auto mb-24 mt-7 flex max-w-8xl flex-col gap-y-3 md:my-14">
        <div className="flex flex-row items-end justify-between">
          <h2 className="fond-black ml-4 text-left text-2xl font-bold tracking-tight md:text-4xl">
            Finances
          </h2>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-white p-3"
          >
            <Link href={`/host/finances/settings/${trimmedConnectId}`}>
              <SettingsIcon size={23} />
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
            <div className="mx-auto flex flex-col gap-y-3">
              {stripeAccount?.requirements?.currently_due &&
                stripeAccount.requirements.currently_due.length > 1 && (
                  <StripeConnectCurrentlyDueBeforePayouts />
                )}

              <FinancesSummary
                hostStripeConnectId={hostStripeConnectId}
                becameHostAt={hostProfile?.becameHostAt}
              />
              <SettingsAndDocuments items={settingsItems} />
            </div>
          )
        ) : (
          <FinanceLoading />
        )}
      </main>
    </DashboadLayout>
  );
}
