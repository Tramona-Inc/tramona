import { api } from "@/utils/api";
import HomeOfferCard from "@/components/landing-page/HomeOfferCard";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

interface SimilarProperties {
  location: string | undefined;
  city: string | undefined;
}

function MobileSimiliarProperties({ location, city }: SimilarProperties) {
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
  //whenever the user switches to a new location we want to reset the display count
  useEffect(() => {
    setDisplayCount(4);
  }, [location, city]);

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
    <div className="relative flex max-h-[300px] flex-col gap-y-2 overflow-y-auto">
      <div className="flex flex-row items-center justify-between text-center">
        <h1 className=" text-nowrap text-center text-sm font-semibold">
          See similar properties in {city!.split(",")[0]}{" "}
        </h1>
        {displayCount < currentProperties!.length && (
          <Button
            className="roundes col-span-2 font-semibold"
            variant="ghost"
            onClick={() => setDisplayCount(displayCount + 4)}
          >
            {" "}
            See more
          </Button>
        )}
      </div>
      <p className="hidden md:flex">
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

            {isFetchingNextPage && skeletons}
            <div className="absolute bottom-[200vh]"></div>
          </div>
        ) : (
          <div className="text-sm md:text-base">
            There are currently no properties available for bidding, please wait
            24 hours and we will have properties for your request.
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileSimiliarProperties;
