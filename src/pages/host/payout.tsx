import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import SpinnerButton from "@/components/_icons/SpinnerButton";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import { useState } from "react";

export default function Payout() {
  const [isLoading, setIsLoading] = useState(false);

  useSession({ required: true });

  const { data: hostInfo } = api.host.getUserHostInfo.useQuery();
  const utils = api.useUtils();

  const { mutateAsync: createStripeConnectAccount } =
    api.stripe.createStripeConnectAccount.useMutation({
      onSuccess: (url) => {
        setIsLoading(false);
        void utils.invalidate();

        if (url) {
          void router.push(url);
        }
      },
    });

  function handleOnClick() {
    setIsLoading(true);
    void createStripeConnectAccount();
  }

  return (
    <DashboadLayout type={"host"}>
      <Head>
        <title>Host Payout | Tramona</title>
      </Head>
      <main className="container flex h-screen flex-col items-center justify-center">
        <h2 className="fond-bold text-4xl">Payout</h2>
        {hostInfo?.chargesEnabled ? (
          <div className="flex flex-col items-center">
            <h2>Stripe account connected</h2>
          </div>
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
