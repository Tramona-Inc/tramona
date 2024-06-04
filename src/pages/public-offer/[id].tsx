// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import OfferPage from "@/components/offers/OfferPage";
import { api } from "@/utils/api";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";

function Page() {
  //this page will only work with offers that are made public
  const router = useRouter();
  const requestId = parseInt(router.query.id as string);
  const { data: offer, isLoading } =
    api.offers.getByPublicIdWithDetails.useQuery(
      { id: requestId },
      {
        enabled: router.isReady,
      },
    );
  console.log("This is the offer");
  console.log(offer);
  if (router.isFallback) {
    return <Spinner />;
  }

  return (
    <DashboadLayout type="guest">
      <Head>
        <title>Offers for you | Tramona</title>
      </Head>
      {!isLoading ? (
        !offer ? (
          <div>Sorry, this offer is not public</div>
        ) : (
          <div>
            <div className="py-4">
              <Link
                href="/requests"
                className="rounded-full px-4 py-2 font-medium text-black hover:bg-white/10"
              >
                &larr; Back to all offers
              </Link>
            </div>
            <div className="mx-6 grid grid-cols-1 grid-rows-4 gap-x-6 gap-y-4 pb-32 lg:grid-cols-3">
              <div className="row-span-3 lg:col-span-2">
                <OfferPage offer={offer} />
              </div>
              {offer.property.latitude && offer.property.longitude && (
                <div className="row-span-1 lg:col-span-1 lg:row-span-3">
                  <SingleLocationMap
                    className="mt-20 md:mt-4 lg:mt-0 "
                    lat={offer.property.latitude}
                    lng={offer.property.longitude}
                  />
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        <Spinner />
      )}
    </DashboadLayout>
  );
}

export default Page;
