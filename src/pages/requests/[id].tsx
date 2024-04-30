import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import OfferPage from "@/components/offers/OfferPage";
import OfferTabs from "@/components/offers/OfferTabs";
import LargeRequestCard from "@/components/requests/[id]/LargeRequestCard";
import OfferCard from "@/components/requests/[id]/OfferCard";
import HowToBookDialog from "@/components/requests/[id]/OfferCard/HowToBookDialog";
import PaywallDialog from "@/components/requests/[id]/PaywallDialog";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { getNumNights } from "@/utils/utils";
import { TagIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


export default function Page() {
  const router = useRouter();
  const requestId = parseInt(router.query.id as string);

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  const { data: offers } = api.offers.getByRequestIdWithProperty.useQuery(
    { id: requestId },
    {
      enabled: router.isReady,
    },
  );

  // ik this seems dumb but its better because it reuses the same
  // getMyRequests query that we (probably) already have cached
  const { data: requests } = api.requests.getMyRequests.useQuery();
  const request = requests?.activeRequestGroups
    .map((group) => group.requests)
    .flat(1)
    .find(({ id }) => id === requestId);

  const { mutate } = api.messages.createConversationWithOffer.useMutation({
    onSuccess: (conversationId) => {
      void router.push(`/messages?conversationId=${conversationId}`);
    },
  });

  function handleConversation({
    offerId,
    offerUserId,
    offerPropertyName,
  }: {
    offerId: string;
    offerUserId: string;
    offerPropertyName: string;
  }) {
    mutate({ offerId, offerUserId, offerPropertyName });
  }


  const [selectedOffer, setSelectedOffer] = useState(null);

  // useEffect(() => {
  //   if (offers && offers.length > 0) {
  //     setSelectedOffer(offers[0]);
  //   }
  // }, [offers]);

  const handleSelectOffer = (offer) => {
    setSelectedOffer(offer);
    console.log(offer);
  };

  return (
    <DashboadLayout type="guest">
      <Head>
        <title>Offers for you | Tramona</title>
      </Head>
      <div className="py-4">
        {/* <div className="absolute inset-0 bg-primary">
          <div className="relative top-1/2 h-1/2 bg-background sm:rounded-t-3xl"></div>
        </div> */}
        {/* <div className="px-4 py-16">
          <div className="mx-auto max-w-xl">
            <LargeRequestCard request={request} />
          </div>
        </div> */}
        <Link
          href="/requests"
          className="rounded-full px-4 py-2 font-medium text-black hover:bg-white/10"
        >
          &larr; Back to all requests
        </Link>
      </div>
      {request && offers ? (
        <div className="px-4">
          <OfferTabs offers={offers} onSelectOffer={handleSelectOffer} />
          <div className="flex space-x-10">
            <div className="flex-1">
              {selectedOffer && <OfferPage offer={selectedOffer} />}
            </div>
            <div></div>
            <div className="flex-1 sticky top-20 h-screen" >
              <div className="h-full">
                <LoadScript
                  googleMapsApiKey="AIzaSyAQk4DZA7D-9OSMigdN97169Pg5dk8p5Zk"
                >
                  <GoogleMap
                    mapContainerStyle={{
                      height: '800px',
                      width: '100%'
                    }}
                    zoom={13}
                    center={{ lat: 37.774929, lng: -122.419416 }}
                  >
                    {/* Child components like Marker, InfoWindow, etc. */}
                    {offers.map((offer) => (
                      offer.property.latitude && offer.property.longitude && (
                        <Marker
                          key={offer.id}
                          position={{ lat: offer.property.latitude, lng: offer.property.longitude }}
                        />
                      )
                    ))}
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        </div>
      ) : (<Spinner />)}

      {/* <div className="px-4 pb-64">
        <div className="mx-auto max-w-5xl">
          <h1 className="flex flex-1 items-center gap-2 py-4 text-3xl font-bold text-black">
            <TagIcon /> Offers for you{" "}
          </h1>
          {request && offers ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  requestId={requestId}
                  checkIn={request.checkIn}
                  checkOut={request.checkOut}
                >
                  <Button
                    onClick={() =>
                      handleConversation({
                        offerId: String(offer.id),
                        offerUserId: offer.property.hostId ?? "",
                        offerPropertyName: offer.property.name,
                      })
                    }
                    variant="outline"
                    className="rounded-full"
                  >
                    Message host
                  </Button>
                  <Button variant="outline" className="rounded-full" asChild>
                    <Link href={`/offers/${offer.id}`}>More details</Link>
                  </Button> */}
      {/* {false offer.isPremium ? ( */}
      {/* <PaywallDialog>
                      <Button variant="gold" className="rounded-lg">
                        Join Tramona Lisa
                      </Button>
                    </PaywallDialog>
                  ) : (
                    <HowToBookDialog
                      isBooked={false} // default will always be false in request page
                      listingId={offer.id}
                      propertyName={offer.property.name}
                      offerNightlyPrice={
                        offer.totalPrice /
                        getNumNights(request.checkIn, request.checkOut)
                      }
                      totalPrice={offer.totalPrice}
                      originalNightlyPrice={
                        offer.property.originalNightlyPrice ?? 0
                      }
                      airbnbUrl={offer.property.airbnbUrl ?? ""}
                      checkIn={request.checkIn}
                      checkOut={request.checkOut}
                      requestId={requestId}
                      offer={offer}
                      isAirbnb={offer.property.airbnbUrl !== null}
                    >
                      <Button className="min-w-20 rounded-full">Book</Button>
                    </HowToBookDialog>
                  )}
                </OfferCard>
              ))}
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </div> */}
    </DashboadLayout>
  );
}
