import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequestsToBook from "@/components/dashboard/host/requests-to-book/HostRequestsToBook";
import HostRequestsLayout from "@/components/dashboard/host/HostRequestsLayout";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <div className="hidden xl:block">
        <HostRequestsLayout>
          <HostRequestsToBook />
        </HostRequestsLayout>
      </div>
      <div className="xl:hidden">
        <div className="mb-16">
          <HostRequestsToBook />
        </div>
      </div>
    </DashboardLayout>
  );
}
