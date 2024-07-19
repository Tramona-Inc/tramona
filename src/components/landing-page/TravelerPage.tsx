import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import Head from "next/head";
import { useEffect } from "react";
import MastHead from "./_sections/MastHead";
import Banner from "./Banner";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { Button } from "../ui/button";
import Link from "next/link";
import { type LpProperty } from "@/pages";

export default function TravelerPage({
  staticProperties,
}: {
  staticProperties: LpProperty[];
}) {
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
        <NewToTramona />
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

const NewToTramona = () => (
  <div className="bg-zinc-100 px-4 py-8">
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
      <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
        New To Tramona?
      </h2>
      <div className="font-medium">
        Check out our FAQ for any questions, or send us a message directly
      </div>
      <Button
        asChild
        variant="greenPrimary"
        size="lg"
        className="w-40 rounded-full"
      >
        <Link href="/faq">FAQ</Link>
      </Button>
    </div>
  </div>
);
