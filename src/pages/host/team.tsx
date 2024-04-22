import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Head from "next/head";

export default function Page() {
  return (
    <DashboardLayout type="host">
      <Head>
        <title>Team | Tramona</title>
      </Head>
      <div className="px-4 pb-32 pt-16">
        <div className="mx-auto max-w-7xl space-y-4">
          <h1 className="text-3xl font-bold">Team</h1>
        </div>
      </div>
    </DashboardLayout>
  );
}
