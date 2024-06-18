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
import { ConnectPayments } from "@stripe/react-connect-js";

export type StripeConnectAccountAndURl =
  RouterOutputs["stripe"]["createStripeConnectAccount"];

export default function Payout() {
  useSession({ required: true });

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

  //setting the client
  //setStripeConnectInstance(data?.stripeAccount);
  function handleOnClick() {
    void createStripeConnectAccount();
  }

  return (
    <DashboadLayout type={"host"}>
      <Head>
        <title>Host Payout | Tramona</title>
      </Head>

      <main className="container flex h-screen flex-col items-center justify-around">
        <h2 className="fond-bold text-4xl">Payout</h2>
        {hostInfo?.stripeAccountId ? (
          <div className="flex flex-col items-center">
            {/* <ConnectPayments /> */}
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
        {data ? (
          <Button>
            {" "}
            <Link href={data!.accountLinkUrl}>Connect</Link>{" "}
          </Button>
        ) : (
          <div></div>
        )}
      </main>
    </DashboadLayout>
  );
}
