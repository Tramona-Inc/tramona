import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import Head from "next/head";
import SimpleMastHead from "./_sections/SimpleMastHead";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  return (
    <div className="container relative overflow-x-hidden">
      <Head>
        <title>Tramona</title>
      </Head>
      <div className="bg-white">
        <SimpleMastHead />
        
      </div>
    </div>
  );
}
