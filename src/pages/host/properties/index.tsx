import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostPropertiesHome from "@/components/dashboard/host/HostPropertiesHome";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout>
      <Head>
        <title>Properties | Tramona</title>
      </Head>
      <HostPropertiesHome />
    </DashboardLayout>
  );
}
