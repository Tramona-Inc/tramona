import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
export default function Payout() {
  useSession({ required: true });

  const { data: hostInfo } = api.host.getUserHostInfo.useQuery();

  const utils = api.useUtils();

  const { mutate: createStripeConnectAccount } =
    api.stripe.createStripeConnectAccount.useMutation({
      onSuccess: () => {
        void utils.invalidate();
      },
    });

  return (
    <>
      <Head>
        <title>Host Payout | Tramona</title>
      </Head>
      <main className="container flex h-screen flex-col items-center justify-center">
        <h2 className="fond-bold text-4xl">Payout</h2>
        {hostInfo?.stripeAccountId ? (
          <div className="flex flex-col items-center">
            <h2>Stripe account connected</h2>
            <Button>Press to get paid</Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2>Stripe account not connected yet!</h2>
            <Button onClick={() => createStripeConnectAccount()}>
              Stripe connect
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
