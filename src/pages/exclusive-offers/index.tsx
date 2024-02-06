import Head from "next/head";

import { Button } from "@/components/ui/button";
import SpecialDealsCard from "@/components/exclusive-offers/special-deals-card";

import { api } from "@/utils/api";

export default function ExclusiveOffersPage() {
  const { data: deals, isLoading } = api.offers.getAllOffers.useQuery();

  return (
    <>
      <Head>
        <title>Exclusive Offers | Tramona</title>
      </Head>

      <section className="container pt-10">
        <h1 className="pb-5 text-4xl font-bold lg:text-5xl">
          Today&apos;s <mark className="bg-gold px-2">Special Deals</mark>
        </h1>
        <p className="text-pretty pb-10 pt-2 text-xl font-semibold tracking-tight lg:tracking-normal">
          Welcome to our exclusive offers. These are deals from our host network
          that you won&apos;t find anywhere else. Book these before they expire!
        </p>

        <p className="text-3xl font-bold lg:text-4xl">Coming soon!</p>
      </section>

      {/* <div className="grid grid-cols-1 place-items-center gap-5 px-5 md:grid-cols-2 md:px-7 lg:grid-cols-3 2xl:grid-cols-4 2xl:px-10">
        {isLoading ? (
          <Button variant="ghost" isLoading disabled>
            Loading...
          </Button>
        ) : (
          <>
            {deals?.length ? (
              deals.map((deal) => {
                return <SpecialDealsCard key={deal.id} deal={deal} />;
              })
            ) : (
              <h2 className="text-xl">No offers to show</h2>
            )}
          </>
        )}
      </div> */}
    </>
  );
}
