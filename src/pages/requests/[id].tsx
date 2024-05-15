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
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Page({ google }: { google: GoogleAPI }) {
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
  const { data: requests } = api.requests.getMyRequests.useQuery();
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
      </Head>
      {request && offers ? (
        <div>
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
                  <div className="h-screen lg:h-full relative">
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

export default GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY ?? "",
})(Page);
