import LargeRequestCard from "@/components/requests/[id]/LargeRequestCard";
import OfferCard from "@/components/requests/[id]/OfferCard";
import { api } from "@/utils/api";
import { Loader2Icon, TagIcon } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const requestId = parseInt(router.query.id as string);

  const { data: offers } = api.offers.getByRequestIdWithProperty.useQuery({
    id: requestId,
  });

  const { data: requests } = api.requests.getMyRequests.useQuery();

  const request = requests?.activeRequests.find(({ id }) => id === requestId);

  return (
    <>
      <Head>
        <title>Offers for you | Tramona</title>
      </Head>
      <div className="relative">
        <div className="absolute inset-0 bg-primary">
          <div className="relative top-1/2 h-1/2 rounded-t-3xl bg-background"></div>
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
