import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequestsLayout from "@/components/dashboard/host/HostRequestsLayout";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout />
    </DashboardLayout>
  );
}
