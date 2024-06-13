import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import AdminUtility from "@/components/admin/AdminUtility";
import Head from "next/head";

export default function IncomingRequests() {
  return (
    <DashboardLayout type="admin">
      <Head>
        <title>Admin Utilities | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center">
            <h1 className="flex-1 py-4 text-3xl font-bold text-black">
              Utility
            </h1>
          </div>

          <AdminUtility />
        </div>
      </div>
    </DashboardLayout>
  );
}
