import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostCityRequestsPage from "@/components/dashboard/host/requests/city/HostCityRequestsPage";
import HostRequestsLayout from "@/components/dashboard/host/requests/HostRequestsLayout";
import HostRequestsToBookPage from "@/components/dashboard/host/requests/requests-to-book/HostRequestsToBookPage";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const isRequestToBook = router.query.tabs === "property-bids" ? true : false;
  return (
    <HostDashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout isIndex={true}>
        {isRequestToBook ? (
          <HostRequestsToBookPage />
        ) : (
          <HostCityRequestsPage />
        )}
      </HostRequestsLayout>
    </HostDashboardLayout>
  );
}
