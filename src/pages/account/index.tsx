import Head from "next/head";
import { useSession } from "next-auth/react";

import AccountSidebar from "@/components/account/AccountSidebar";
import CashbackAccount from "@/components/account/CashbackAccount";
import ReferFolks from "@/components/account/ReferFolks";

import { api } from "@/utils/api";
import ReferralDashboard from "@/components/profile/ReferralDashboard";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";

export default function MyAccount() {
  useSession({ required: true });

  // const { data, isLoading } = api.referralCodes.getReferralEarnings.useQuery();

  // const cashbackBalance =
  //   data?.reduce((prev, item) => {
  //     if (item.earningStatus === "pending") {
  //       return prev + item.cashbackEarned;
  //     }

  //     return prev;
  //   }, 0) ?? 0;

  // const recentEarnings = data?.slice(0, 3);

  return (
    <>
      <Head>
        <title>My Account | Tramona</title>
      </Head>
      <DashboardLayout type="guest">
        <ReferralDashboard />
      </DashboardLayout>
    </>
  );
}
