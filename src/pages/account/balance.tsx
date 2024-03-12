import Head from "next/head";
import { useSession } from "next-auth/react";

import AccountSidebar from "@/components/account/AccountSidebar";
import CashbackBalanceDetails from "@/components/account/cashback/CashbackBalanceDetails";
import { ReferralTable } from "@/components/account/cashback/ReferralTable";
import { referralColumns } from "@/components/account/cashback/ReferralColumns";
import Spinner from "@/components/_common/Spinner";

import { api } from "@/utils/api";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

export type ReferralTableData =
  inferRouterOutputs<AppRouter>["referralCodes"]["getReferralEarnings"];

export default function CashbackBalance() {
  useSession({ required: true });

  const { data, isLoading } = api.referralCodes.getReferralEarnings.useQuery();

  const cashbackBalance =
    data?.reduce((prev, item) => {
      if (item.earningStatus === "pending") {
        return prev + item.cashbackEarned;
      }

      return prev;
    }, 0) ?? 0;

  return (
    <>
      <Head>
        <title>Cashback Balance | Tramona</title>
      </Head>
      <div className="min-h-screen-minus-header gap-10 space-y-5 bg-zinc-100 px-5 pt-5 lg:flex lg:space-y-0">
        <AccountSidebar />
        <div className="w-full space-y-5">
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <CashbackBalanceDetails balance={cashbackBalance} />

              <div className="rounded-xl bg-zinc-50 shadow-md">
                <ReferralTable data={data ?? []} columns={referralColumns} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
