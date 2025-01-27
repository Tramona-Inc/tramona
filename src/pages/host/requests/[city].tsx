import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequests from "@/components/dashboard/host/requests/city/HostRequests";
import HostRequestsLayout from "@/components/dashboard/host/requests/HostRequestsLayout";
import Head from "next/head";
import { useIsLg } from "@/utils/utils";

export default function Page() {
  const isLg = useIsLg();

  return (
    <DashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>

      <HostRequestsLayout isIndex={false}>
        <HostRequests />
      </HostRequestsLayout>
    </DashboardLayout>
  );
}
