import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import OfferPage from "@/components/offers/OfferPage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { ArrowLeftIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ShareButton from "@/components/_common/ShareLink/ShareButton";
import { type OfferWithDetails } from "@/components/offers/OfferPage";

import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next";
import { db } from "@/server/db";
import { offers } from "@/server/db/schema/tables/offers";
import { requests } from "@/server/db/schema/tables/requests";
import { and, eq } from "drizzle-orm";

import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";
import { useMediaQuery } from "@uidotdev/usehooks";
import MobileOfferPage from "@/components/offers/MobileOfferPage";

type PageProps = {
  offer: OfferWithDetails; // Replace with a more specific type if you have one
  serverRequestId: number;
  serverFirstImage: string;
  serverFirstPropertyName: string;
  serverRequestLocation: string; // Ensure this is a plain string
  baseUrl: string;
};

function Page({
  serverRequestId,
  serverFirstImage,
  serverRequestLocation,
  serverFirstPropertyName,
  baseUrl,
}: PageProps) {
  const router = useRouter();
  const requestId = parseInt(router.query.id as string);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [applyOverflowHidden, setApplyOverflowHidden] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 37.774929,
    lng: -122.419416,
  }); // Default center

  const { data: offers } = api.offers.getByRequestIdWithProperty.useQuery(
    { id: requestId },
    {
      enabled: router.isReady,
    },
  );

  useEffect(() => {
    const offer = offers?.find((o) => `${o.id}` === selectedOfferId);
    if (offer?.property.longitude && offer.property.latitude) {
      setMapCenter({
        lat: offer.property.latitude,
        lng: offer.property.longitude,
      });
    }
  }, [selectedOfferId, offers]);

  const [effectHasRun, setEffectHasRun] = useState(false);

  useEffect(() => {
    if (offers?.[0] && !effectHasRun) {
      setEffectHasRun(true);
      setSelectedOfferId(`${offers[0].id}`);
    }
  }, [offers, effectHasRun]);

  // ik this seems dumb but its better because it reuses the same
  // getMyRequests query that we (probably) already have cached
  const { data: requests } = api.requests.getMyRequestsPublic.useQuery();
  const request = requests?.activeRequestGroups
    .map((group) => group.requests)
    .flat(1)
    .find(({ id }) => id === requestId);

  if (router.isFallback) {
    return <Spinner />;
  }

  return (
    <DashboardLayout type="guest">
      <NextSeo
        title={serverFirstPropertyName}
        description={`Check out your tramona offers in ${serverRequestLocation}`}
        canonical={`${baseUrl}/requests/${serverRequestId}`}
        openGraph={{
          url: `${baseUrl}/requests/${serverRequestId}`,
          type: "website",
          title: serverFirstPropertyName,
          description: `Check out your tramona offers in ${serverRequestLocation}`,
          images: [
            {
              url: serverFirstImage,
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
              type: "image/jpeg",
            },
          ],
          site_name: "Tramona",
        }}
      />
      <div className="flex justify-center max-w-full overflow-x-hidden lg:overflow-x-visible lg:px-0">
        {request && offers ? (
          <div className="min-h-screen-minus-header lg:px-4 pb-footer-height pt-5">
            <div className="mx-auto w-[360px] lg:max-w-7xl">
              <div className="flex items-center justify-center lg:justify-center">
                <div className="px-4 lg:mx-16">
                  <div className="hidden lg:block">
                    <Button asChild variant="ghost" className="rounded-full">
                      <Link href="/requests">
                        <ArrowLeftIcon /> Back to requests
                      </Link>
                    </Button>
                  </div>
                  <div className="lg:hidden">
                    <Button asChild variant="ghost" className="rounded-full">
                      <Link href="/requests">
                        <ChevronLeft className="-mx-1"/>
                        <div className="font-semibold">Requests</div>
                      </Link>
                    </Button>
                  </div>
                  <div className="px-4 pb-32">
                    <Tabs
                      defaultValue={`${offers[0]?.id}`}
                      value={selectedOfferId}
                      onValueChange={setSelectedOfferId}
                    >
                      <div className="relative w-full mt-5">
                      <TabsList className="w-max">
                        {offers.map((offer, i) => (
                          <TabsTrigger key={offer.id} value={`${offer.id}`}>
                            Offer {i + 1}
                          </TabsTrigger>
                        ))}
                        <div className="hidden lg:block absolute top-0 right-0">
                          <ShareButton
                            id={request.id}
                            isRequest={true}
                            propertyName={offers[0]!.property.name}
                          />
                        </div>
                      </TabsList>
                      </div>

                      <div className="flex flex-col lg:flex-col">
                        {offers.map((offer) => (
                          <TabsContent key={offer.id} value={`${offer.id}`}>
                            <OfferPage offer={offer} mapCenter={mapCenter} />
                          </TabsContent>
                        ))}
                      </div>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const serverRequestId = parseInt(context.query.id as string);
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app"; //change to your live dev server

  const firstPropertyOfRequest = await db.query.offers.findFirst({
    where: and(eq(offers.requestId, serverRequestId)),
    with: {
      property: true,
    },
  });

  const serverFirstImage = firstPropertyOfRequest!.property.imageUrls[0] ?? "";

  const serverFirstPropertyName =
    firstPropertyOfRequest?.property.name ?? "Tramona property";

  const serverRequestLocationResult = await db
    .select({
      location: requests.location,
    })
    .from(requests)
    .where(eq(requests.id, serverRequestId));

  const serverRequestLocation = serverRequestLocationResult[0]?.location ?? "";

  return {
    props: {
      serverRequestLocation,
      serverRequestId,
      serverFirstImage,
      serverFirstPropertyName,
      baseUrl,
    },
  };
};

export default Page;
