import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import Head from "next/head";
import Listings from "./_sections/Listings";
import SimpleMastHead from "./_sections/SimpleMastHead";
import CitiesFilter from "./CitiesFilter";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  return (
    <div className="relative mb-20 overflow-x-hidden bg-white pt-10">
      <Head>
        <title>Tramona</title>
      </Head>
      <div className="container">
        <SimpleMastHead />
      </div>

      <div className="py-5">
        <div className="border-[1px]" />
      </div>

      <div className="container flex flex-col space-y-5 bg-white">
        <CitiesFilter />
        <Listings />
        {/* <LongLatFilter /> */}
      </div>
    </div>
  );
}
