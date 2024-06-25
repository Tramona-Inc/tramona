import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import SpinnerButton from "@/components/_icons/SpinnerButton";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

import { useEffect, useState } from "react";
import type { RouterOutputs } from "@/utils/api";
import {
  ConnectPayments,
  ConnectAccountOnboarding,
  ConnectNotificationBanner,
  ConnectAccountManagement,
  ConnectBalances,
} from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";
import Spinner from "@/components/_common/Spinner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/utils";
import { ExternalAccount } from "stripe";
import Stripe from "stripe";
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

  const { data: accountBalance } =
    api.stripe.checkStripeConnectAcountBalance.useQuery(hostStripeAccountId!, {
      enabled: !!hostStripeAccountId,
    });

  const { data: externalBanks } = api.stripe.getConnectedExternalBank.useQuery(
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

  //this is just to make typescript happy
  function isBankAccount(
    account: ExternalAccount,
  ): account is Stripe.BankAccount {
    return "bank_name" in account;
  }
  function isCard(account: ExternalAccount): account is Stripe.Card {
    return "brand" in account;
  }
  return (
    <DashboadLayout type={"host"}>
      <Head>
        <title>Host Payout | Tramona</title>
      </Head>

      <main className="container flex h-screen flex-col items-center  gap-y-8">
        <h2 className="fond-bold text-4xl">Payout</h2>
        {/* We are going to break this into two states  
        1. Host has an exising stripeAcont + isAccountIdReady loading State
        2. Host Does not have an existing stripe account and needs to make one + plus loading state 
        <ConnnectPayments is needs isAccountIdRead true otherewise there will be an error
        */}
        <div className="flex w-full flex-col justify-around gap-y-3">
          <h1 className="mx-24 mt-10 w-screen text-3xl font-semibold">
            Balance
          </h1>

          <div className=" flex flex-row justify-start gap-x-16 ">
            <div>
              <h2 className="text-xl font-bold">Pending Amount</h2>
              {accountBalance &&
                accountBalance.pending.map((item) => (
                  <div
                    key={item.currency + "-pending"}
                    className="font-semibold"
                  >
                    <div className="flex flex-row gap-x-1 gap-y-1">
                      <p>
                        {item.currency === "usd"
                          ? formatCurrency(item.amount)
                          : item.amount}
                      </p>
                      <p>{item.currency}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <h2 className="text-xl font-bold">Available Amount</h2>
              {accountBalance &&
                accountBalance.available.map((item) => (
                  <div
                    key={item.currency + "-available"}
                    className="font-semibold"
                  >
                    <div className="flex flex-row gap-x-1 gap-y-1">
                      <p>
                        {item.currency === "usd"
                          ? formatCurrency(item.amount)
                          : item.amount}
                      </p>
                      <p>{item.currency}</p>
                    </div>
                  </div>
                ))}
            </div>
            <div>
              <h2 className="text-xl font-bold">Available Instant Amount</h2>
              {accountBalance ? (
                accountBalance.instant_available!.map((item) => (
                  <div
                    key={item.currency + "-available"}
                    className="font-semibold"
                  >
                    <div className="flex flex-row gap-x-1 gap-y-1">
                      <p>
                        {item.currency === "usd"
                          ? formatCurrency(item.amount)
                          : item.amount}
                      </p>
                      <p>{item.currency}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No instant available balance</p>
              )}
              <div>
                <h2 className="text-xl font-bold">Connected Banks</h2>
                {externalBanks ? (
                  externalBanks.map((account) => {
                    if (isBankAccount(account)) {
                      return (
                        <div key={account.id}>
                          <p>{account.bank_name}</p>
                          <p>{account.account_holder_name}</p>
                          <p>{account.last4}</p>
                          <p>{account.routing_number}</p>
                          <p>{account.status}</p>
                        </div>
                      );
                    } else if (isCard(account)) {
                      return (
                        <div key={account.id}>
                          <p>{account.brand}</p>
                          <p>{account.last4}</p>
                          <p>{account.exp_month}</p>
                          <p>{account.exp_year}</p>
                        </div>
                      );
                    }
                    // Handle other types of external accounts if necessary
                    return null;
                  })
                ) : (
                  <div>No connected accounts</div>
                )}
              </div>
            </div>
          </div>
        </div>
        {hostInfo?.stripeAccountId && (
          <div className="flex justify-around">
            {isStripeConnectInstanceReady ? (
              <div className="relative my-3 flex w-full flex-row items-center justify-around gap-x-10">
                <ConnectNotificationBanner
                // Optional:
                // collectionOptions={{
                //   fields: 'eventually_due',
                //   futureRequirements: 'include',
                // }}
                />
                <ConnectAccountManagement
                // Optional:
                // collectionOptions={{
                //   fields: 'eventually_due',
                //   futureRequirements: 'include',
                // }}
                />
                <ConnectPayments />
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
      </main>
    </DashboadLayout>
  );
}
