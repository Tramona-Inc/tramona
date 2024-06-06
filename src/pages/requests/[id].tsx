// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import OfferPage from "@/components/offers/OfferPage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import {
  Circle,
  GoogleApiWrapper,
  Map,
  type GoogleAPI,
} from "google-maps-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ShareOfferDialog from "@/components/_common/ShareLink/ShareOfferDialog";
import { NextSeo } from "next-seo";

import { db } from "@/server/db";
import { offers } from "@/server/db/schema/tables/offers";
import { and, eq } from "drizzle-orm";

type PageProps = {
  offer: OfferWithDetails; // Replace with a more specific type if you have one
  serverRequestId: number;
  serverFirstImage: string;
  serverFirstPropertyName: string;
  google: GoogleAPI;
};
//using server as prefix to differentiate between the server and client requests
function Page({
  google,
  serverRequestId,
  serverFirstImage,
  serverFirstPropertyName,
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
  const [firstImage, setFirstImage] = useState("");

  useEffect(() => {
    const offer = offers?.find((o) => `${o.id}` === selectedOfferId);
    if (offer?.property.longitude && offer.property.latitude) {
      setMapCenter({
        lat: offer.property.latitude,
        lng: offer.property.longitude,
      });
      setFirstImage(offer.property.imageUrls[0] ?? "");
    }
  }, [selectedOfferId]);

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

  const { mutate: handleConversation } =
    api.messages.createConversationWithOffer.useMutation({
      onSuccess: (conversationId) => {
        void router.push(`/messages?conversationId=${conversationId}`);
      },
    });

  if (router.isFallback) {
    return <Spinner />;
  }

  return (
    <DashboadLayout type="guest">
      <Head>
        <title>Offers for you | Tramona</title>
        <NextSeo
          title="Offers for you | Tramona"
          description="Check this property out -- Sign up here, from any device!"
          canonical={`https://tramona.com/requests/${requestId}`}
          openGraph={{
            url: `https://tramona.com/requests/${requestId}`,
            type: "website",
            title: "Check my properties out",
            description:
              "Check this property out -- Sign up here, from any device!",
            images: [
              {
                url: firstImage,
                width: 900,
                height: 800,
                alt: "Og Image Alt Second",
                type: "image/jpeg",
              },
            ],
            site_name: "Tramona",
          }}
        />
      </Head>
      {request && offers ? (
        <div className=" mx-auto md:w-[98%]">
          <div className="py-4">
            <Link
              href="/requests"
              className="rounded-full px-4 py-2 font-medium text-black hover:bg-white/10"
            >
              &larr; Back to all requests
            </Link>
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
                  {" "}
                  <ShareOfferDialog
                    id={request.id}
                    isRequest={true}
                    linkImage={firstImage}
                    propertyName={offers[0].request.location}
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
                    <Map google={google} zoom={15} center={mapCenter}>
                      {/* Child components like Marker, InfoWindow, etc. */}
                      {offers.map(
                        (offer, i) =>
                          offer.property.latitude &&
                          offer.property.longitude && (
                            <Circle
                              key={i} // Unique key for each Circle
                              radius={200}
                              fillColor={
                                selectedOfferId === `${offer.id}`
                                  ? "#1F362C"
                                  : "#CCD9D7"
                              }
                              strokeColor="black"
                              center={{
                                lat: offer.property.latitude,
                                lng: offer.property.longitude,
                              }}
                              onClick={() => setSelectedOfferId(`${offer.id}`)}
                              label={`Offer ${i + 1}`}
                            ></Circle>
                          ),
                      )}
                    </Map>
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
  const firstPropertyOfRequest = await db.query.offers.findFirst({
    where: and(eq(offers.requestId, serverRequestId)),
  });
  const serverFirstImage =
    firstPropertyOfRequest?.property.imageUrls?.[0] ?? "";
  const serverFirstPropertyName =
    firstPropertyOfRequest?.request.location ?? "";
  const serverRequestLocation = await db.query.requests.findFirst({
    where: { id: serverRequestId },
    select: { location: true },
  });
  console.log("serverRequestLocation", serverRequestLocation);
  console.log("serverFirstImage", serverFirstImage);
  return {
    props: {
      serverRequestId,
      serverFirstImage,
      serverFirstPropertyName,
    },
  };
};

export default GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY ?? "",
})(Page);
