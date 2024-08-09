import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostRequestsLayout from "@/components/dashboard/host/HostRequestsLayout";
import { api } from "@/utils/api";
import Head from "next/head";

export default function Page() {
  const { data: offers } = api.biddings.getAllHostPending.useQuery();

  return (
    <DashboardLayout>
      <Head>
        <title>Offers & Requests | Tramona</title>
      </Head>
      <HostRequestsLayout />
      {/* <div className="flex flex-col items-center justify-center">
        <HostPropertyOffers />
      </div> */}
    </DashboardLayout>
  );
}
