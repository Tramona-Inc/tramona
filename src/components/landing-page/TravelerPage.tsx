import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import Head from "next/head";
import Listings from "./_sections/Listings";
import SimpleMastHead from "./_sections/SimpleMastHead";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  return (
    <div className="container relative mb-20 mt-10 overflow-x-hidden">
      <Head>
        <title>Tramona</title>
      </Head>
      <div className="flex flex-col space-y-20 bg-white">
        <SimpleMastHead />
        <Listings />
      </div>
    </div>
  );
}
