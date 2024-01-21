import OfferCard from "@/components/OfferCard";
import { api } from "@/utils/api";
import { Loader2Icon, TagIcon } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const requestId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : NaN;

  const { data: offers } = api.offers.getByRequestIdWithProperty.useQuery({
    id: requestId,
  });

  const { data: requests } = api.requests.getMyRequests.useQuery();

  const request = requests?.activeRequests.find(({ id }) => id === requestId);

  return (
    <>
      <Head>
        <title>Your Requests | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
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
                  checkIn={request.checkIn}
                  checkOut={request.checkOut}
                />
              ))}
            </div>
          ) : (
            <Loader2Icon className="col-span-full mx-auto mt-16 size-12 animate-spin text-accent" />
          )}
        </div>
      </div>
    </>
  );
}
