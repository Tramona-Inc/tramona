import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import Head from "next/head";
import Listings from "./_sections/Listings";
import SimpleMastHead from "./_sections/SimpleMastHead";
import CitiesFilter from "./CitiesFilter";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  return (
    <div className="relative mb-20 mt-10 overflow-x-hidden">
      <Head>
        <title>Tramona</title>
      </Head>
      <div className='container border-b'>
        <SimpleMastHead />
      </div>
      <div className="container flex flex-col space-y-5 bg-white pt-10">
        <CitiesFilter />
        <Listings />
      </div>
    </div>
  );
}
