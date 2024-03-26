import Head from "next/head";

import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardLayout from "../_common/Layout/DashboardLayout";
import { useMaybeSendUnsentRequests } from '@/utils/useMaybeSendUnsentRequests';

export default function DashboardPage() {
  useMaybeSendUnsentRequests();

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>Dashboard | Tramona</title>
      </Head>

      <DashboardOverview />
    </DashboardLayout>
  );
}
