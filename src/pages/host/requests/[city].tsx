import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequests from "@/components/dashboard/host/requests/city/HostRequests";
import HostRequestsLayout from "@/components/dashboard/host/requests/HostRequestsLayout";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <div className="hidden xl:block">
        <HostRequestsLayout>
          <HostRequests />
        </HostRequestsLayout>
      </div>
      <div className="xl:hidden">
        <div className="mb-16">
          <HostRequests />
        </div>
      </div>
    </DashboardLayout>
  );
}
