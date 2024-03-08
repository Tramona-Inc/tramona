import Head from "next/head";

import DashboardLayout from "@/components/_common/DashboardLayout";
import DashboardOverview from '../DashboardOverview';



export default function HostDashboardPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | Tramona</title>
      </Head>

      <DashboardOverview />
    </DashboardLayout>
  );
}
