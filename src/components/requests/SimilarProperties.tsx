import { api } from "@/utils/api";
import HomeOfferCard from "@/components/landing-page/HomeOfferCard";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { on } from "events";
interface SimilarProperties {
  location: string | undefined;
  city: string | undefined;
}

function SimiliarProperties({ location, city }: SimilarProperties) {
  //convert the cities names in to lat lng
  //create an array of the new citers
  //const locationCoordinates : { lat: number; lng: number } = {};
  if (!location) {
    return <div>Unavailable properties for this location</div>;
  }

  const { data: coordinates } = api.offers.getCoordinates.useQuery({
    location: location!,
  });

  const {
    data: properties,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.properties.getAllInfiniteScroll.useInfiniteQuery({
    lat: coordinates?.coordinates.lat,
    long: coordinates?.coordinates.lng,
    radius: 25,
  });

  const currentProperties = useMemo(
    () => properties?.pages.flatMap((page) => page.data) ?? [],
    [properties],
  );
  const [displayCount, setDisplayCount] = useState(4);
  const skeletons = (
    <div className="relative grid grid-cols-2 gap-6">
      {" "}
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="">
          <div className=" flex h-[290px] flex-col justify-center gap-y-2 rounded-lg">
            <Skeleton className="aspect-square h-[200px]  rounded-xl" />
            <SkeletonText />
            <SkeletonText />
          </div>
        </div>
      ))}{" "}
    </div>
  );

  return (
    <div className="flex h-[1400px] flex-col gap-y-4 overflow-y-auto">
      <h1 className="text-xl font-bold">
        See similar properties in {city!.split(",")[0]}{" "}
      </h1>
      <p>
        {" "}
        Submit bids while waiting for your request to increase your chance of
        getting a great deal.
      </p>
      <div className="my-4">
        {isLoading ? (
          // if we're still fetching the initial currentProperties, display the loader
          <>{skeletons}</>
        ) : currentProperties.length > 0 ? (
          // if there are currentProperties to show, display them
          <div className="relative grid grid-cols-2 gap-6">
            {currentProperties.slice(0, displayCount).map((property) => (
              <div className=" col-span-1">
                <HomeOfferCard key={property.id} property={property} />
              </div>
            ))}
            <Button
              className="roundes col-span-2 font-semibold"
              variant="secondaryLight"
              onClick={() => setDisplayCount(displayCount + 4)}
            >
              {" "}
              See more similar properties
            </Button>
            {isFetchingNextPage && skeletons}
            <div className="absolute bottom-[200vh]"></div>
          </div>
        ) : (
          <div>
            There are currently no properties available for bidding, please wait
            24 hours and we will have properties for your request.
          </div>
        )}
      </div>
    </div>
  );
}

export default SimiliarProperties;
