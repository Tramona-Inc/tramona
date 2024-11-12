import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostRequestsLayout from "@/components/dashboard/host/HostRequestsLayout";
import Head from "next/head";

export default function Page() {
  return (
    <HostDashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout />
    </HostDashboardLayout>
  );
}
