import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostRequests from "@/components/dashboard/host/requests/city/HostRequests";
import HostRequestsLayout from "@/components/dashboard/host/requests/HostRequestsLayout";
import HostRequestsToBook from "@/components/dashboard/host/requests/requests-to-book/HostRequestsToBook";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const isRequestToBook =
    router.query.tabs === "request-to-book" ? true : false;
  return (
    <HostDashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout>
        {isRequestToBook ? <HostRequestsToBook /> : <HostRequests />}
      </HostRequestsLayout>
    </HostDashboardLayout>
  );
}
