import NewRequestForm from "@/components/requests/NewRequestForm";
import { requireAuth } from "@/server/auth";
import Head from "next/head";

export const getServerSideProps = requireAuth;

export default function Page() {
  return (
    <>
      <Head>
        <title>Your Requests | Tramona</title>
      </Head>
      <p className="p-8">your requests</p>
      <NewRequestForm />
    </>
  );
}
