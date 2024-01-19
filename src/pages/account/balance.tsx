import Head from "next/head";

import AccountSidebar from "@/components/account/AccountSidebar";
import CashbackBalanceDetails from "@/components/account/cashback/CashbackBalanceDetails";
import { ReferralTable } from "@/components/account/cashback/ReferralTable";
import { referrals } from "@/components/account/cashback/referrals";
import { referralColumns } from "@/components/account/cashback/ReferralColumns";

export default function CashbackBalance() {
  return (
    <>
      <Head>Cashback Balance | Tramona</Head>
      <div className="flex min-h-[calc(100vh-5.25rem)] gap-10 bg-zinc-100 px-5 pt-5">
        <AccountSidebar />
        <div className="w-full space-y-5">
          <CashbackBalanceDetails />

          <div className="rounded-xl bg-zinc-50 shadow-md">
            <h2 className="px-10 py-6 text-3xl font-bold">
              Cash Back on Referral
            </h2>
            <ReferralTable data={referrals} columns={referralColumns} />
          </div>
        </div>
      </div>
    </>
  );
}
