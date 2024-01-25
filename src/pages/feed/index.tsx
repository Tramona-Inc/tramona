import FeedCard from "@/components/feed/feed-card";
import { api } from "@/utils/api";
import Head from "next/head";

export default function Dashboard() {
  const { data: offers, isLoading } = api.offers.getAllOffers.useQuery();

  return (
    <>
      <Head>Tramona - Feed</Head>
      <section className="container my-10">
        <h1>Social Feed</h1>
        <div className="grid gap-5 md:grid-cols-2">
          {offers ? (
            offers.map((offer) => {
              return <FeedCard key={offer.id} offer={offer} />;
            })
          ) : (
            <h1>No public</h1>
          )}
        </div>
      </section>
    </>
  );
}
