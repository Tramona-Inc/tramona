import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Listings from "./_sections/Listings";
import SimpleMastHead from "./_sections/SimpleMastHead";
import MastHead from "./_sections/MastHead";
import CitiesFilter from "./CitiesFilter";
import Banner from "./Banner";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();
  const { data: session } = useSession();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const verificationStatus = session?.user?.isIdentityVerified;
    if (verificationStatus === "true" || verificationStatus === "pending") {
      const bannerKey = `bannerShown-${verificationStatus}`;
      if (!localStorage.getItem(bannerKey)) {
        setShowBanner(true);
        localStorage.setItem(bannerKey, "true");
      }
    } else {
      setShowBanner(false);
    }
  }, [session]);

  const handleCloseBanner = () => {
    setShowBanner(false);
    const verificationStatus = session?.user?.isIdentityVerified;
    if (verificationStatus === "true" || verificationStatus === "pending") {
      const bannerKey = `bannerShown-${verificationStatus}`;
      localStorage.setItem(bannerKey, "true");
    }
  };

  const bannerType = session?.user?.isIdentityVerified;

  return (
    <div className="relative mb-20 overflow-x-hidden bg-white">
      <Head>
        <title>Tramona</title>
      </Head>
      {showBanner && (bannerType === "true" || bannerType === "pending") && (
        <div className="p-5">
          <Banner type={bannerType} onClose={handleCloseBanner} />
        </div>
      )}
      <div className="container">{/* <SimpleMastHead /> */}</div>
      <div>
        <MastHead />
      </div>
      <div className="py-5">
        <div className="border-[1px]" />
      </div>
      <div className="container flex flex-col space-y-5 bg-white">
        <CitiesFilter />
        <Listings />
        {/* ! For testing purposes */}
        {/* <LongLatFilter /> */}
      </div>
    </div>
  );
}
