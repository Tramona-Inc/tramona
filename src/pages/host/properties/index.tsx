import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostPropertiesLayout from "@/components/dashboard/host/HostPropertiesLayout";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout>
      <Head>
        <title>Properties | Tramona</title>
      </Head>
      <HostPropertiesLayout />
    </DashboardLayout>
  );
}
