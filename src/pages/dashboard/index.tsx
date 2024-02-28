import Head from "next/head";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard | Tramona</title>
      </Head>

      <div className="grid min-h-[calc(100vh-4.5rem)] grid-cols-12">
        <DashboardSidebar />

        <DashboardOverview />
      </div>
    </>
  );
}
