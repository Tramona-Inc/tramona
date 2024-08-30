import Head from "next/head";
import { useSession } from "next-auth/react";

import CashbackBalanceDetails from "@/components/account/cashback/CashbackBalanceDetails";
import { ReferralTable } from "@/components/account/cashback/ReferralTable";
import { referralColumns } from "@/components/account/cashback/ReferralColumns";
import Spinner from "@/components/_common/Spinner";

import { type RouterOutputs, api } from "@/utils/api";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { ConnectNotificationBanner } from "@stripe/react-connect-js";
import useIsStripeConnectInstanceReady from "@/utils/store/stripe-connect";

export type ReferralTableData =
  RouterOutputs["referralCodes"]["getReferralCodeInfo"];

export default function CashbackBalance() {
  useSession({ required: true });

  const { data: earnings, isLoading } =
    api.referralCodes.getReferralCodeInfo.useQuery();

  const { data: allEarningTransactions } =
    api.referralCodes.getAllEarningsByReferralCode.useQuery();

  const { isStripeConnectInstanceReady } = useIsStripeConnectInstanceReady();
  console.log(" here is the code object", allEarningTransactions);
  return (
    <>
      <Head>
        <title>Cashback Balance | Tramona</title>
      </Head>
      <DashboardLayout>
        <div className="mx-auto flex min-h-screen-minus-header-n-footer max-w-4xl flex-col">
          {isStripeConnectInstanceReady && (
            <ConnectNotificationBanner
              collectionOptions={{
                fields: "eventually_due",
                futureRequirements: "include",
              }}
            />
          )}
          <div className="mt-6 grid grid-cols-1 px-4 lg:mt-16 lg:px-0">
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="space-y-4">
                <CashbackBalanceDetails
                  balance={earnings?.curBalance}
                  totalBookingVolume={earnings?.totalBookingVolume}
                />
                {allEarningTransactions && (
                  <ReferralTable
                    columns={referralColumns}
                    data={allEarningTransactions}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
