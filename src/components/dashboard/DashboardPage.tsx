import Head from "next/head";

import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardLayout from "../_common/Layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout type="guest">
      <Head>
        <title>Dashboard | Tramona</title>
      </Head>

      <DashboardOverview />
    </DashboardLayout>
  );
}
