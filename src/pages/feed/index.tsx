import Head from "next/head";

import FeedCard from "@/components/feed/feed-card";
import { Button } from "@/components/ui/button";

import { api } from "@/utils/api";

export default function Dashboard() {
  const { data: offers, isLoading } = api.offers.getAllOffers.useQuery();

  return (
    <>
      <Head>
        <title>Social Feed | Tramona</title>
      </Head>

      <section className="container my-10">
        <h1 className="pb-5 text-center text-4xl font-bold lg:text-5xl">
          Social Feed
        </h1>

        <div className="grid grid-cols-1 place-items-center gap-5">
          {isLoading ? (
            <Button variant="ghost" isLoading disabled>
              Loading...
            </Button>
          ) : (
            <>
              {offers?.length ? (
                offers.map((offer) => {
                  return <FeedCard key={offer.id} offer={offer} />;
                })
              ) : (
                <h2 className="text-xl">No offers to show</h2>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
