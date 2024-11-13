import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostRequests from "@/components/dashboard/host/requests/HostRequests";
import HostRequestsLayout from "@/components/dashboard/host/requests/HostRequestsLayout";
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
        {isRequestToBook ? <div> umm</div> : <HostRequests />}
      </HostRequestsLayout>
    </HostDashboardLayout>
  );
}
