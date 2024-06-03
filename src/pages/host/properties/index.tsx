import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import HostProperties from "@/components/dashboard/host/HostProperties";
import HostPropertiesLayout from "@/components/dashboard/host/HostPropertiesLayout";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <Head>
        <title>Properties | Tramona</title>
      </Head>
      <HostPropertiesLayout>
        <div className="mx-auto my-10 min-h-screen-minus-header-n-footer max-w-4xl rounded-2xl border">
          {/* <HostProperties /> */}
        </div>
      </HostPropertiesLayout>
    </DashboardLayout>
  );
}
