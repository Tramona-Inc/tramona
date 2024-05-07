import React from "react";
import Head from "next/head";
import Listings from "./_sections/Listings";
import SimpleMastHead from "./_sections/SimpleMastHead";
import CitiesFilter from "./CitiesFilter";
import Banner from "./Banner";
import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import MastHead from "./_sections/MastHead";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  return (
    <VerificationProvider>
      <div className="mb-20 overflow-x-hidden bg-white">
        <Head>
          <title>Tramona</title>
        </Head>
        <VerificationBanner />

        {/* <div className="container">
          <SimpleMastHead />
        </div>

        <div className="py-5">
          <div className="border-[1px]" />
        </div> */}

        <div>
          <MastHead />
        </div>


        <div className="md:mt-72 container flex flex-col space-y-5 bg-white">
          <CitiesFilter />
          <Listings />
        </div>
      </div>
    </VerificationProvider>
  );
}

const VerificationBanner = () => {
  const { showBanner, status, setShowVerificationBanner } = useVerification();
  const handleCloseBanner = () => {
    setShowVerificationBanner(false);
  };

  if (!showBanner || (status !== "true" && status !== "pending")) return null;
  return <Banner type={status} onClose={handleCloseBanner} />;
};
