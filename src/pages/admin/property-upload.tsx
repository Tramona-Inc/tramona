import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import AdminPropertyForm from "@/components/admin/AdminPropertyForm";
import Head from "next/head";

export default function propertyUpload() {
  return (
    <DashboardLayout type="admin">
      <Head>
        <title>Admin Property Upload | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center">
            <h1 className="flex-1 py-4 text-3xl font-bold text-black">
              Admin Property Upload
            </h1>
          </div>

          <AdminPropertyForm />
        </div>
      </div>
    </DashboardLayout>
  );
}
