import HostDashboardLayout from "@/components/_common/DashboardLayout/Host";
import Head from "next/head";

export default function Page() {
  return (
    <HostDashboardLayout>
      <Head>
        <title>Host Dashboard | Tramona</title>
      </Head>
      <div className="w-full">
        <h1>Host Layout</h1>
      </div>
    </HostDashboardLayout>
  );
}
