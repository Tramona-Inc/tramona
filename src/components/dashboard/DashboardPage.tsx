import Head from "next/head";

import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardLayout from "../_common/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | Tramona</title>
      </Head>

      <DashboardOverview />
    </DashboardLayout>
  );
}
