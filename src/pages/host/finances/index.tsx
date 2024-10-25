import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import NoStripeAccount from "@/components/host/finances/NoStripeAccount";
import { ConnectNotificationBanner } from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import { useRouter } from "next/router";
import StripeConnectCurrentlyDueBeforePayouts from "@/components/host/finances/StripeConnectCurrentlyDueBeforePayout";
import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";

export default function Page() {
  useSession({ required: true });
  const router = useRouter();

  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();
  const { data: user } = api.users.getUser.useQuery();

  const [hostStripeConnectId, sethostStripeConnectId] = useState<string>("");

  const { data: stripeAccount, isLoading: stripeLoading } =
    api.stripe.retrieveStripeConnectAccount.useQuery(hostStripeConnectId, {
      enabled: hostStripeConnectId !== "",
    });

  useEffect(() => {
    if (user?.stripeConnectId) {
      sethostStripeConnectId(user.stripeConnectId);
    }
  }, [user]);

  useEffect(() => {
    // Ensure router navigation happens after checking stripeAccount data
    if (
      isStripeConnectInstanceReady &&
      stripeAccount?.requirements?.currently_due &&
      stripeAccount.requirements.currently_due.length <= 1
    ) {
      void router.push(`/host/finances/${hostStripeConnectId.slice(5)}`); // Safely push to router
    }
  }, [
    isStripeConnectInstanceReady,
    stripeAccount,
    hostStripeConnectId,
    router,
  ]);

  return (
    <HostDashboardLayout>
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
          stripeLoading ? (
            <div>Loading Stripe account details...</div>
          ) : stripeAccount!.requirements!.currently_due!.length > 1 ? (
            <StripeConnectCurrentlyDueBeforePayouts />
          ) : (
            <div>Redirecting...</div>
          )
        ) : (
          <NoStripeAccount />
        )}
      </main>
    </HostDashboardLayout>
  );
}
