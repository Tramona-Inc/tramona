import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useEffect, useMemo, useState } from "react";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import OfferCardNoBid from "./property-cards/OfferCardNoBid";
interface SimilarProperties {
  location: string;
  city: string;
}

function SimiliarProperties({ location, city }: SimilarProperties) {
  //convert the cities names in to lat lng
  //create an array of the new citers
  //const locationCoordinates : { lat: number; lng: number } = {};

  const { data: coordinates } = api.offers.getCoordinates.useQuery({
    location: location,
  });

  // ! Update later to fix the optional chain
  const {
    data: properties,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
  } = api.properties.getAllInfiniteScroll.useInfiniteQuery({
    lat: coordinates?.coordinates?.lat ?? 0,
    long: coordinates?.coordinates?.lng ?? 0,
    radius: 25,
  });

  const currentProperties = useMemo(
    () => properties?.pages.flatMap((page) => page.data) ?? [],
    [properties],
  );
  const [displayCount, setDisplayCount] = useState<number>(4);
  //whenever the user switches to a new location we want to reset the display count
  useEffect(() => {
    setDisplayCount(4);
  }, [location, city]);

  if (!location) {
    return <div>Unavailable properties for this location</div>;
  }
  const skeletons = (
    <div className="relative grid grid-cols-2 gap-6">
      {" "}
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="">
          <div className=" flex h-[290px] flex-col justify-center gap-y-2 rounded-lg">
            <Skeleton className="aspect-square h-[220px]  rounded-xl" />
            <SkeletonText />
          </div>
        </div>
      ))}{" "}
    </div>
  );

  return (
    <div className="relative flex h-[1000px] flex-col gap-y-4 overflow-y-auto">
      <h1 className=" text-xl font-bold">
        See similar properties in {city.split(",")[0]}{" "}
      </h1>
      <p className="hidden md:flex">
        {" "}
        Submit bids while waiting for your request to increase your chance of
        getting a great deal.
      </p>
      <div className="my-4">
        {isFetching ? (
          // if we're still fetching the initial currentProperties, display the loader
          <>{skeletons}</>
        ) : currentProperties.length > 0 ? (
          // if there are currentProperties to show, display them
          <div className="relative grid grid-cols-2 gap-6">
            {currentProperties.slice(0, displayCount).map((property, index) => (
              <div className=" col-span-1" key={index}>
                <OfferCardNoBid key={property.id} property={property} />
              </div>
            ))}
            {displayCount < currentProperties.length && (
              <Button
                className="roundes col-span-2 font-semibold"
                variant="secondaryLight"
                onClick={() => setDisplayCount(displayCount + 4)}
              >
                {" "}
                See similar properties
              </Button>
            )}
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
