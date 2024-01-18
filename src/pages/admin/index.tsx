import DisplayRequests from "@/components/Admin/DisplayRequests";
import FormRequest from "@/components/FormRequest";
import { requireRole } from "@/server/auth";
import Head from "next/head";

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
          <FormRequest />
        </div>
        <DisplayRequests />
      </div>
    </>
  );
}
