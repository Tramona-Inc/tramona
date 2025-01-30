import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequestsLayout from "@/components/dashboard/host/requests/HostRequestsLayout";
import Head from "next/head";
import HostRequestsToBookPage from "@/components/dashboard/host/requests/requests-to-book/HostRequestsToBookPage";

export default function Page() {
  return (
    <DashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout isIndex={false}>
        <HostRequestsToBookPage isIndex={false} />
      </HostRequestsLayout>
    </DashboardLayout>
  );
}
