import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequests from "@/components/dashboard/host/HostRequests";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequests />
    </DashboardLayout>
  );
}
