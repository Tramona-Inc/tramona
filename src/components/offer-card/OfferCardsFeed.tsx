import OfferCard from "./OfferCard";

import { ScrollArea } from "@/components/ui/scroll-area";
import { type LiveFeedOffer } from "./data";

type Props = {
  offers: LiveFeedOffer[];
};

export default function OfferCardsFeed({ offers }: Props) {
  const feed = offers;

  return (
    <div>
      <section className="container">
        <h1 className="hidden p-5 text-center text-3xl font-bold md:block xl:block">
          Recent Deals
        </h1>

        <ScrollArea className="max-h-[50vh] overflow-y-auto">
          <div className="flex flex-col gap-3">
            {feed?.map((offer: LiveFeedOffer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </ScrollArea>
      </section>
    </div>
  );
}
