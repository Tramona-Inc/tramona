import Requests from "@/components/Admin/Requests";
import AdminFormRequest from "@/components/Admin/AdminFormRequest";
import Head from "next/head";
import AdminFormProperty from "@/components/Admin/AdminFormProperty";
import { useRequireRole } from "@/utils/auth-utils";

export default function Page() {
  useRequireRole(["admin"]);

  return (
    <>
      <Head>
        <title>Admin Dashboard | Tramona</title>
      </Head>
      <div className="container flex flex-col space-y-5">
        <h1 className="text-bold text-4xl uppercase">admin dashboard</h1>
        <div className="flex gap-5">
          <AdminFormRequest />
          <AdminFormProperty />
        </div>
        <Requests />
      </div>
    </>
  );
}
