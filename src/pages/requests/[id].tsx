import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import OfferPage from "@/components/offers/OfferPage";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ShareButton from "@/components/_common/ShareLink/ShareButton";
import { type OfferWithDetails } from "@/components/property/PropertyPage";

import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next";
import { db } from "@/server/db";
import { offers } from "@/server/db/schema/tables/offers";
import { requests } from "@/server/db/schema/tables/requests";
import { and, eq } from "drizzle-orm";

import SingleLocationMap from "@/components/_common/GoogleMaps/SingleLocationMap";

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
    <DashboadLayout type="guest">
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
      {request && offers ? (
        <div>
          <div className="p-4">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/requests">
                <ArrowLeftIcon /> Back to all requests
              </Link>
            </Button>
          </div>
          <div className="px-4 pb-32">
            <Tabs
              defaultValue={`${offers[0]?.id}`}
              value={selectedOfferId}
              onValueChange={setSelectedOfferId}
            >
              <TabsList className="w-max">
                {offers.map((offer, i) => (
                  <TabsTrigger key={offer.id} value={`${offer.id}`}>
                    Offer {i + 1}
                  </TabsTrigger>
                ))}
                <div className="mx-4  mt-5 flex h-full items-center justify-center">
                  <ShareButton
                    id={request.id}
                    isRequest={true}
                    propertyName={offers[0]!.request.location}
                  />
                </div>
              </TabsList>

              <div className="flex flex-col lg:flex-row lg:space-x-10">
                <div className="flex-1">
                  {offers.map((offer) => (
                    <TabsContent key={offer.id} value={`${offer.id}`}>
                      <OfferPage offer={offer} />
                    </TabsContent>
                  ))}
                </div>
                <div className="top-5 mt-5 flex-1 lg:sticky lg:mt-0 lg:h-screen">
                  <div className="relative h-screen lg:h-full">
                    <SingleLocationMap
                      key={`${mapCenter.lat}-${mapCenter.lng}`} // Unique key to force re-render
                      lat={mapCenter.lat}
                      lng={mapCenter.lng}
                    />
                  </div>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </DashboadLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const serverRequestId = parseInt(context.query.id as string);
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "http://localhost:3000/"; //change to your live dev server

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
