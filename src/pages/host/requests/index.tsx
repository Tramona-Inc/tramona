import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequestsLayout from "@/components/dashboard/host/HostRequestsLayout";
import HostPropertyOffers from "@/components/host/HostPropertyOffers";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout />
      <div className="flex flex-col items-center justify-center">
        <HostPropertyOffers />
      </div>
    </DashboardLayout>
  );
}
