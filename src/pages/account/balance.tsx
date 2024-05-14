import Head from "next/head";
import { useSession } from "next-auth/react";

import AccountSidebar from "@/components/account/AccountSidebar";
import CashbackBalanceDetails from "@/components/account/cashback/CashbackBalanceDetails";
import { ReferralTable } from "@/components/account/cashback/ReferralTable";
import { referralColumns } from "@/components/account/cashback/ReferralColumns";
import Spinner from "@/components/_common/Spinner";

import { type RouterOutputs, api } from "@/utils/api";
import MainLayout from "@/components/_common/Layout/MainLayout";

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
      <MainLayout>
        <div className="mx-auto min-h-screen-minus-header max-w-4xl gap-10 space-y-5 px-5 pt-5 lg:flex lg:space-y-0">
          {/* <AccountSidebar /> */}
          <div className="w-full space-y-5">
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                <CashbackBalanceDetails balance={cashbackBalance} />

                <div>
                  <ReferralTable data={data ?? []} columns={referralColumns} />
                </div>
              </>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
}
