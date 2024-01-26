import FeedCard from "@/components/feed/feed-card";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import Head from "next/head";

export default function Dashboard() {
  const { data: offers, isLoading } = api.offers.getAllOffers.useQuery();

  return (
    <>
      <Head>Tramona - Feed</Head>
      <section className="container my-10">
        <h1 className="pb-5 text-4xl font-bold lg:pb-10 lg:text-5xl">
          Social Feed
        </h1>
        {isLoading ? (
          <Button variant="ghost" isLoading disabled>
            Loading...
          </Button>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {offers?.length ? (
              offers.map((offer) => {
                return <FeedCard key={offer.id} offer={offer} />;
              })
            ) : (
              <h2 className="text-xl">No offers to show</h2>
            )}
          </div>
        )}
      </section>
    </>
  );
}
