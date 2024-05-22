import Head from "next/head";
import { useSession } from "next-auth/react";

import CashbackBalanceDetails from "@/components/account/cashback/CashbackBalanceDetails";
import { ReferralTable } from "@/components/account/cashback/ReferralTable";
import { referralColumns } from "@/components/account/cashback/ReferralColumns";
import Spinner from "@/components/_common/Spinner";

import { type RouterOutputs, api } from "@/utils/api";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";

export type ReferralTableData =
  RouterOutputs["referralCodes"]["getReferralEarnings"];

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
      <DashboardLayout type="guest">
        <div className="mx-auto flex min-h-screen-minus-header-n-footer max-w-4xl flex-col">
          <div className="mt-6 grid grid-cols-1 px-4 lg:mt-16 lg:px-0">
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="space-y-4">
                <CashbackBalanceDetails balance={cashbackBalance} />
                <ReferralTable data={data ?? []} columns={referralColumns} />
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
