import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import HomeOfferCard from "@/components/landing-page/HomeOfferCard";
import { useMemo } from "react";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
interface SimilarPropertiesProps {
  locations: string[] | undefined;
}

function SimiliarProperties({ locations }: SimilarPropertiesProps) {
  //convert the cities names in to lat lng
  //create an array of the new citers
  const coordinatesArray: { lat: number; lng: number }[] = [];
  if (locations) {
    locations.forEach(async (location) => {
      const { data: coordinates } = api.offers.getCoordinates.useQuery({
        location,
      });
      console.log(coordinates?.coordinates);
      if (coordinates?.coordinates) {
        const { lat, lng } = coordinates.coordinates;
        coordinatesArray.push({ lat: Number(lat), lng: Number(lng) });
      }
    });
  }
  console.log(coordinatesArray);

  //filter them out using the filter function
  //const filters = useCitiesFilter((state) => state);

  const {
    data: properties,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.properties.getAllInfiniteScroll.useInfiniteQuery({
    lat: coordinatesArray[0]?.lat,
    long: coordinatesArray[0]?.lng,
    radius: 50,
  });

  const currentProperties = useMemo(
    () => properties?.pages.flatMap((page) => page.data) ?? [],
    [properties],
  );
  console.log(currentProperties);

  const skeletons = Array.from({ length: 12 }, (_, index) => (
    <div key={index}>
      <Skeleton className="aspect-square rounded-xl" />
      <div className="flex h-[90px] flex-col justify-center">
        <SkeletonText />
        <SkeletonText />
      </div>
      <Skeleton className="h-10 rounded-lg" />
      <Skeleton className="mt-2 h-10 rounded-xl" />
    </div>
  ));

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">See Similar Properties in Blank </h1>
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
            {currentProperties.map((property) => (
              <div className=" col-span-1">
                <HomeOfferCard key={property.id} property={property} />
              </div>
            ))}
            {isFetchingNextPage && skeletons}
            <div className="absolute bottom-[200vh]"></div>
          </div>
        ) : (
          <div> Make a request or bid to related properties.</div>
        )}
      </div>
    </div>
  );
}

export default SimiliarProperties;
