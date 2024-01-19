import Requests from "@/components/Admin/Requests";
import AdminFormRequest from "@/components/Admin/AdminFormRequest";
import { requireRole } from "@/server/auth";
import Head from "next/head";
import AdminFormOffer from "@/components/Admin/AdminFormOffer";

export const getServerSideProps = requireRole(["admin"]);

export default function Page() {
  return (
    <>
      <Head>
        <title>Admin Dashboard | Tramona</title>
      </Head>
      <div className="container flex flex-col space-y-5">
        <h1 className="text-bold text-4xl uppercase">admin dashboard</h1>
        <div>
          <AdminFormRequest />
        </div>
        <Requests />
      </div>
    </>
  );
}
