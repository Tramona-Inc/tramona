import HostDashboardLayout from "@/components/_common/DashboardLayout/Host";
import HostOverview from "@/components/dashboard/host/HostOverview";
import Head from "next/head";

export default function Page() {
  return (
    <HostDashboardLayout>
      <Head>
        <title>Host Dashboard | Tramona</title>
      </Head>
      <HostOverview />
    </HostDashboardLayout>
  );
}
