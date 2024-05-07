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

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  return (
    <VerificationProvider>
      <div className="relative mb-20 overflow-x-hidden bg-white pt-10">
        <Head>
          <title>Tramona</title>
        </Head>
        <VerificationBanner />
        <div className="container">
          <SimpleMastHead />
        </div>

        <div className="py-5">
          <div className="border-[1px]" />
        </div>

        <div className="container flex flex-col space-y-5 bg-white">
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