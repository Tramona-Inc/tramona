import Head from "next/head";
import { useSession } from "next-auth/react";

import AccountSidebar from "@/components/account/AccountSidebar";
import CashbackAccount from "@/components/account/CashbackAccount";
import ReferFolks from "@/components/account/ReferFolks";

import { api } from "@/utils/api";

export default function MyAccount() {
  useSession({ required: true });

  const { data, isLoading } = api.referralCodes.getReferralEarnings.useQuery();

  const cashbackBalance =
    data?.reduce((prev, item) => {
      if (item.earningStatus === "pending") {
        return prev + item.cashbackEarned;
      }

      return prev;
    }, 0) ?? 0;

  const recentEarnings = data?.slice(0, 3);

  return (
    <>
      <Head>
        <title>My Account | Tramona</title>
      </Head>
      <div className="min-h-[calc(100vh-5rem)] gap-10 space-y-5 bg-zinc-100 px-5 pt-5 lg:flex lg:space-y-0">
        <AccountSidebar />
        <div className="w-full space-y-5">
          <CashbackAccount
            isLoading={isLoading}
            cashbackBalance={cashbackBalance}
            recentEarnings={recentEarnings}
          />
          <ReferFolks />
        </div>
      </div>
    </>
  );
}
