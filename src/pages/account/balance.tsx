import Head from "next/head";

import AccountSidebar from "@/components/account/AccountSidebar";
import CashbackBalanceDetails from "@/components/account/cashback/CashbackBalanceDetails";
import { ReferralTable } from "@/components/account/cashback/ReferralTable";
import { referralColumns } from "@/components/account/cashback/ReferralColumns";
import { api } from "@/utils/api";
import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/server/api/root";

export type ReferralTableData =
  inferRouterOutputs<AppRouter>["referralCodes"]["getReferralEarnings"];

export default function CashbackBalance() {
  const { data, isLoading } = api.referralCodes.getReferralEarnings.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Cashback Balance | Tramona</title>
      </Head>
      <div className="min-h-[calc(100vh-5rem)] gap-10 space-y-5 bg-zinc-100 px-5 pt-5 lg:flex lg:space-y-0">
        <AccountSidebar />
        <div className="w-full space-y-5">
          <CashbackBalanceDetails />

          <div className="rounded-xl bg-zinc-50 shadow-md">
            <h2 className="px-5 py-6 text-2xl font-bold lg:px-10 lg:text-3xl">
              Cash Back on Referral
            </h2>
            <ReferralTable data={data ?? []} columns={referralColumns} />
          </div>
        </div>
      </div>
    </>
  );
}
