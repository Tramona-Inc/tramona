import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import Head from "next/head";
import { useEffect } from "react";
import Listings from "./_sections/Listings";
import SimpleMastHead from "./_sections/SimpleMastHead";
import Banner from "./Banner";
import CitiesFilter from "./CitiesFilter";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  const { data, error } = api.biddings.getAllPropertyBids.useQuery();

  const setInitialBids = useBidding((state) => state.setInitialBids);
  const propertyIdBids = useBidding((state) => state.propertyIdBids);

  useEffect(() => {
    if (!error) {
      setInitialBids(data ?? []);
    }
  }, [data, error, setInitialBids]);

  console.log("Initial", propertyIdBids);

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
