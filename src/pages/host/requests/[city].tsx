import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostCityRequestsPage from "@/components/dashboard/host/requests/city/HostCityRequestsPage";
import HostRequestsLayout from "@/components/dashboard/host/requests/HostRequestsLayout";
import Head from "next/head";
import { useIsLg } from "@/utils/utils";

export default function Page() {
  return (
    <DashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>

      <HostRequestsLayout isIndex={false}>
        <HostCityRequestsPage />
      </HostRequestsLayout>
    </DashboardLayout>
  );
}
