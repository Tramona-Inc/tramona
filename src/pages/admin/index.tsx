import Head from "next/head";
import { useRequireRole } from "@/utils/auth-utils";
import AdminRequestsTabs from "@/components/admin/AdminRequestsTabs";

export default function Page() {
  useRequireRole(["admin"]);

  return (
    <>
      <Head>
        <title>Your Requests | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center">
            <h1 className="flex-1 py-4 text-3xl font-bold text-black">
              Incoming requests
            </h1>
          </div>
          <AdminRequestsTabs />
        </div>
      </div>
    </>
  );
}
