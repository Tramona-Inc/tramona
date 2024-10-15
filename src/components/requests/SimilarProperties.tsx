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

  // ! Update later to fix the optional chain
  const {
    data: properties,
    isFetching,
    isFetchingNextPage,
  } = api.properties.getAllInfiniteScroll.useInfiniteQuery(
    {
      // lat: coordinates?.coordinates.location?.lat ?? 0,
      // long: coordinates?.coordinates.location?.lng ?? 0,
      radius: 25,
    },
    { refetchOnWindowFocus: false },
  );

  const currentProperties = useMemo(
    () => properties?.pages.flatMap((page) => page.data),
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
  const skeletons = Array.from({ length: 4 }, (_, index) => (
    <div key={index} className="flex flex-col gap-2 rounded-lg">
      <Skeleton className="aspect-square rounded-xl" />
      <SkeletonText />
    </div>
  ));

  return (
    <div className="sticky top-header-height h-screen-minus-header-n-footer space-y-4 overflow-y-auto py-8">
      <h1 className="text-xl font-bold">
        See similar properties in {city.split(",")[0]}
      </h1>
      <p className="hidden md:flex">
        Submit bids while waiting for your request to increase your chance of
        getting a great deal.
      </p>
      <div className="my-4">
        {currentProperties?.length === 0 ? (
          <div>
            There are currently no properties available for bidding, please wait
            24 hours and we will have properties for your request.
          </div>
        ) : (
          <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-2">
            {currentProperties && !isFetching ? (
              <>
                {currentProperties.slice(0, displayCount).map((property) => (
                  <OfferCardNoBid key={property.id} property={property} />
                ))}
                {displayCount < currentProperties.length && (
                  <Button
                    className="col-span-full"
                    variant="secondary"
                    onClick={() => setDisplayCount(displayCount + 4)}
                  >
                    Show more
                  </Button>
                )}
                {isFetchingNextPage && skeletons}
              </>
            ) : (
              skeletons
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SimiliarProperties;
