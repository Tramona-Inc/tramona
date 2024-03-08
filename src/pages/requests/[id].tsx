import Spinner from "@/components/_common/Spinner";
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

export default function Page() {
  const router = useRouter();
  const requestId = parseInt(router.query.id as string);

  const { data: offers } = api.offers.getByRequestIdWithProperty.useQuery(
    { id: requestId },
    {
      enabled: router.isReady,
    },
  );

  const { data: requests } = api.requests.getMyRequests.useQuery();

  const request = requests?.activeRequestGroups
    .map((group) => group.requests)
    .flat(1)
    .find(({ id }) => id === requestId);

  const { mutate } = api.messages.createConversationWithAdmin.useMutation({
    onSuccess: (conversationId) => {
      void router.push(`/messages?conversationId=${conversationId}`);
    },
  });

  function handleConversation() {
    mutate();
  }

  return (
    <>
      <Head>
        <title>Offers for you | Tramona</title>
      </Head>
      <div className="relative">
        <div className="absolute inset-0 bg-primary">
          <div className="relative top-1/2 h-1/2 bg-background sm:rounded-t-3xl"></div>
        </div>
        <div className="px-4 py-16">
          <div className="mx-auto max-w-xl">
            <LargeRequestCard request={request} />
          </div>
        </div>
        <Link
          href="/requests"
          className="absolute left-4 top-4 rounded-full px-4 py-2 font-medium text-white hover:bg-white/10"
        >
          &larr; Back to all requests
        </Link>
      </div>
      <div className="px-4 pb-64">
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
                    onClick={() => handleConversation()}
                    size="lg"
                    variant="outline"
                    className="rounded-full"
                  >
                    Message
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full">
                    <Link href={`/listings/${offer.id}`}>More details</Link>
                  </Button>
                  {false /* offer.isPremium */ ? (
                    <PaywallDialog>
                      <Button size="lg" variant="gold" className="rounded-lg">
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
                      originalNightlyPrice={offer.property.originalNightlyPrice}
                      airbnbUrl={offer.property.airbnbUrl ?? ""}
                      checkIn={request.checkIn}
                      checkOut={request.checkOut}
                      requestId={requestId}
                      offer={offer}
                      isAirbnb={offer.property.airbnbUrl !== null}
                    >
                      <Button size="lg" className="min-w-32 rounded-full">
                        Book
                      </Button>
                    </HowToBookDialog>
                  )}
                </OfferCard>
              ))}
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </>
  );
}
