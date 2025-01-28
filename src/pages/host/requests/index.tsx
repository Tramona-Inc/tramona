import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostRequests from "@/components/dashboard/host/requests/city/HostCityRequestsPage";
import HostRequestsLayout from "@/components/dashboard/host/requests/HostRequestsLayout";
import HostRequestsToBook from "@/components/dashboard/host/requests/requests-to-book/HostRequestsToBook";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const isRequestToBook = router.query.tabs === "property-bids" ? true : false;
  const isIndex = !router.query.option;
  return (
    <HostDashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout isIndex={isIndex}>
        {isRequestToBook ? <HostRequestsToBook /> : <HostRequests />}
      </HostRequestsLayout>
    </HostDashboardLayout>
  );
}
