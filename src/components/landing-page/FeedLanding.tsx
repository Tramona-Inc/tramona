import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import FeedCardSm from "../_common/FeedCardSm";
// import useGlobalFeed from '@/hooks/useGlobalFeed';
import type { OfferType } from "@/types";
import { fakeOffers } from "@/fake-data/offers";

export default function FeedLanding() {
  /**
   * TODO:
   * 1. fetch feeds from new backend /offers API
   * 2. make it a global state storage
   */
  //   const { feed, isLoading, isError } = useGlobalFeed();
  const feed = fakeOffers;

  return (
    <div>
      <section className=" ">
        <h1 className="hidden p-5 text-center text-3xl font-bold md:block xl:block">
          Recent Deals
        </h1>
        <div className="flex justify-center">
          <div className="w-1/2 rounded-md border-2"></div>
        </div>

        {/* <div className="flex items-center justify-center p-5 xl:hidden">
          <h1 className="flex gap-2 rounded-2xl bg-red-600 p-2 px-5 font-bold text-white">
            <Icons.radio color="white" />
            Live
          </h1>
        </div> */}

        {/* Hidden the scrollbar */}
        <ScrollArea className="scrollbar-hide group max-h-[45vh] space-y-5 overflow-y-auto text-black md:max-h-[30vh] lg:max-h-[30vh]">
          <div className="animate-loop-scroll flex flex-col gap-5 group-hover:paused">
            {/* {isLoading && <h1>Loading</h1>} */}
            {feed?.map((offer: OfferType) => (
              <FeedCardSm key={offer.id} offer={offer} />
            ))}
          </div>
          <div className='aria-hidden="true" animate-loop-scroll flex flex-col gap-5 group-hover:paused'>
            {/* {isLoading && <h1>Loading</h1>} */}
            {feed?.map((offer: OfferType) => (
              <FeedCardSm key={offer.id} offer={offer} />
            ))}
          </div>
          {/* <ScrollBar orientation='vertical' /> */}
        </ScrollArea>
      </section>
    </div>
  );
}
