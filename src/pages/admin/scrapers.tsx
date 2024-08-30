import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import AdminScrapers from "@/components/admin/AdminScrapers";
import Head from "next/head";

export default function IncomingRequests() {
  return (
    <DashboardLayout>
      <Head>
        <title>Unclaimed Offers Scrapers | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center">
            <h1 className="flex-1 py-4 text-3xl font-bold text-black">
              Unclaimed Offers Scrapers
            </h1>
          </div>

          <AdminScrapers />
        </div>
      </div>
    </DashboardLayout>
  );
}
