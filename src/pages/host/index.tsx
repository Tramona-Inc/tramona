import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostOverview from "@/components/dashboard/host/HostOverview";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <Head>
        <title>Host Dashboard | Tramona</title>
      </Head>
      <HostOverview />
    </DashboardLayout>
  );
}
