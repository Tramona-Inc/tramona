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
import CitiesFilter from "./CitiesFilter";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { Button } from "../ui/button";
import Link from "next/link";
import { type StaticProperty } from "@/pages";
import HomeOfferCard from "./HomeOfferCard";
import { useIsLg, useIsMd, useIsSm, useIsXl } from "@/utils/utils";

export default function TravelerPage({
  staticProperties,
}: {
  staticProperties: StaticProperty[];
}) {
  useMaybeSendUnsentRequests();

  const isSm = useIsSm();
  const isMd = useIsMd();
  const isLg = useIsLg();
  const isXl = useIsXl();

  const numPropertiesShown = isXl ? 15 : isLg ? 12 : isMd ? 9 : isSm ? 6 : 3;

  const shownProperties = staticProperties.slice(0, numPropertiesShown);

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
        <section className="space-y-4 p-4">
          <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
            Explore popular destinations
          </h2>
          <div className="sticky top-header-height">
            <CitiesFilter isLandingPage />
          </div>
          <section className="relative grid grid-cols-1 grid-rows-2 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {shownProperties.map((p) => (
              <HomeOfferCard key={p.id} property={p} />
            ))}
          </section>
          <div className="flex items-center justify-center py-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/explore">View all properties</Link>
            </Button>
          </div>

          <NewToTramona />
        </section>
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
  <div className="rounded-xl bg-teal-700/15 px-4 py-8">
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4">
      <h2 className="text-center text-2xl font-extrabold lg:text-4xl">
        New To Tramona?
      </h2>
      <div className=" font-medium">
        Check out our FAQ for any questions, or send us a message directly
      </div>
      <Button asChild size="lg" className="w-40 rounded-full">
        <Link href="/faq">FAQ</Link>
      </Button>
    </div>
  </div>
);
