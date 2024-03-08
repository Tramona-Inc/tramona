import Link from "next/link";

import Spinner from "../_common/Spinner";
import type { ReferralCashback } from "./cashback/referrals";
import { formatCurrency } from "@/utils/utils";

export default function CashbackAccount({
  cashbackBalance,
  recentEarnings,
  isLoading,
}: {
  cashbackBalance: number;
  recentEarnings: ReferralCashback[] | undefined;
  isLoading: boolean;
}) {
  return (
    <div className="flex flex-col space-y-6 rounded-xl bg-white px-5 py-6 shadow-md lg:px-10">
      <h1 className="text-3xl font-bold lg:text-4xl">My Cash Back Account</h1>

      <div className="justify-center space-x-0 space-y-5 lg:flex lg:space-x-5 lg:space-y-0">
        <div className="space-y-5 rounded-xl bg-white py-10 text-center shadow-md lg:w-1/3">
          <p className="text-xl font-semibold">Balance</p>
          <p className="text-6xl font-bold text-primary lg:text-7xl">
            {isLoading ? <Spinner /> : formatCurrency(cashbackBalance)}
          </p>
        </div>

        {/* <RecentlyAdded /> */}
        <div className="flex flex-col space-y-8 rounded-xl bg-white px-8 py-4 shadow-md lg:w-2/3">
          <h2 className="text-2xl font-bold lg:text-3xl">Recently added</h2>

          {isLoading ? (
            <Spinner />
          ) : (
            <div className="space-y-1">
              {recentEarnings?.length === 0 ? (
                <p>No recent earnings</p>
              ) : (
                recentEarnings?.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between rounded-lg px-2 py-1 shadow-sm"
                  >
                    <p>{transaction.referee.name}</p>
                    <p className="font-bold text-primary">
                      {formatCurrency(transaction.cashbackEarned)}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          <Link
            href="/account/balance"
            className="pb-2 text-center text-lg font-medium text-primary underline underline-offset-2"
          >
            See Cash Back Balance
          </Link>
        </div>
      </div>
    </div>
  );
}
