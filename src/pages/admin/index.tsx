import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import AdminRequestsTabs from "@/components/admin/AdminRequestsTabs";
import Head from "next/head";

export default function Page() {
  return (
    <DashboadLayout type="admin">
      <Head>
        <title>Admin Dashboard | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center">
            <h1 className="flex-1 py-4 text-3xl font-bold text-black">
              Admin Dashboard
            </h1>
          </div>
          <AdminRequestsTabs />
        </div>
      </div>
    </DashboadLayout>
  );
}
