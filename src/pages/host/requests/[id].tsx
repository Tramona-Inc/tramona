import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequests from "@/components/dashboard/host/HostRequests";
import HostRequestsLayout from "@/components/dashboard/host/HostRequestsLayout";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout>
        <HostRequests />
      </HostRequestsLayout>
    </DashboardLayout>
  );
}
