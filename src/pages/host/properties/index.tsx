import HostDashboardLayout from "@/components/_common/Layout/HostDashboardLayout";
import HostPropertiesLayout from "@/components/dashboard/host/HostPropertiesLayout";
import Head from "next/head";

export default function Page() {
  return (
    <HostDashboardLayout>
      <Head>
        <title>Properties | Tramona</title>
      </Head>
      <HostPropertiesLayout />
    </HostDashboardLayout>
  );
}
