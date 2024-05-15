import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import Head from "next/head";
import { useEffect } from "react";
import Listings from "./_sections/Listings";
import MastHead from "./_sections/MastHead";
import Banner from "./Banner";
import CitiesFilter from "./CitiesFilter";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";

export default function TravelerPage() {
  useMaybeSendUnsentRequests();

  const { data: isPropertyBids, error: propertyBidsError } =
    api.biddings.getAllPropertyBids.useQuery(undefined, {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  const { data: isBucketListProperty, error: bucketListError } =
    api.profile.getAllPropertiesInBucketList.useQuery(undefined, {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  const setInitialBids = useBidding((state) => state.setInitialBids);

  const setInitialBucketList = useBidding(
    (state) => state.setInitialBucketList,
  );

  useEffect(() => {
    if (!propertyBidsError || !bucketListError) {
      setInitialBids(isPropertyBids ?? []);
      setInitialBucketList(isBucketListProperty ?? []);
    }
  }, [
    isPropertyBids,
    propertyBidsError,
    bucketListError,
    setInitialBids,
    isBucketListProperty,
    setInitialBucketList,
  ]);

  return (
    <VerificationProvider>
      <Head>
        <title>Tramona</title>
      </Head>
      <div className="relative mb-20 overflow-x-hidden bg-white">
        <VerificationBanner />
        <MastHead />
        <div className="space-y-4 p-4">
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
