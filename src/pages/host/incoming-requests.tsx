import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <Head>
        <title>Incoming Requests | Tramona</title>
      </Head>
    </DashboardLayout>
  );
}
