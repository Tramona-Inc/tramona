import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useIntersection } from "@mantine/hooks"; // a hook that we'll be using to detect when the user reaches the bottom of the page
import { useEffect, useMemo } from "react";
import HomeOfferCard from "../HomeOfferCard";
import { Button } from "@/components/ui/button";
import ListingsEmptySvg from "@/components/_common/EmptyStateSvg/ListingsEmptySvg";
import { FilterXIcon } from "lucide-react";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";
import Link from "next/link";
export default function SearchListings({
  isFilterUndefined,
  callSiblingFunction,
}: {
  isFilterUndefined: boolean;
  callSiblingFunction: () => void;
}) {
  const filters = useCitiesFilter((state) => state);

  // The properties that the map is currently displaying
  const { adjustedProperties } = useAdjustedProperties();

  // Fetching properties based on filters
  const {
    data: properties,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.properties.getAllInfiniteScroll.useInfiniteQuery(
    {
      guests: filters.guests,
      beds: filters.beds,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      maxNightlyPrice: filters.maxNightlyPrice,
      lat: filters.filter?.lat,
      long: filters.filter?.long,
      houseRules: filters.houseRules,
      roomType: filters.roomType,
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
      radius: filters.radius,
    },
    {
      // the cursor from where to start fetching the current properties
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  // Use intersection observer to detect when the user reaches the bottom of the page
  const { entry, ref } = useIntersection({
    root: null, // null means observing in the context of the viewport
    threshold: 1,
  });

  // Fetch more properties when the user reaches the bottom of the page
  useEffect(() => {
    if (
      entry?.isIntersecting &&
      properties?.pages.length &&
      properties.pages[properties.pages.length - 1]?.nextCursor
    ) {
      if (
        filters.locationBoundingBox.northeastLat === 0 &&
        filters.guests === 0
      ) {
        console.log("fetching next page for initial properties");
        void fetchNextPage();
      } else {
        console.log("fetched next page of adjusted from listing ");
        callSiblingFunction();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  // Use memoization to avoid re-computing properties on every render
  const currentProperties = useMemo(() => {
    if (adjustedProperties !== null) {
      console.log("using adjusted properties");
      return adjustedProperties.pages.flatMap((page) => page.data);
    }
    return properties?.pages.flatMap((page) => page.data) ?? [];
  }, [adjustedProperties, properties]);

  // Skeleton loading state for better UX
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

  const locationName = filters.filter?.label.includes(',') ? filters.filter.label.split(',')[0] : filters.filter?.label

  // Main component rendering
  return (
    <section
      className={`relative grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 ${
        isFilterUndefined
          ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          : "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
      }`}
    >
      {isLoading ? (
        // if we're still fetching the initial properties, display the loader
        <>{skeletons}</>
      ) : currentProperties.length > 0 ? (
        // if there are properties to show, display them
        <>
          {currentProperties.map((property) => (
            <HomeOfferCard
              key={
                //we were getting duplicate keys so we added this random number
                property.id * 11134 * Math.random()
              }
              property={property}
            />
          ))}
          {isFetchingNextPage && skeletons}
          <div ref={ref} className="absolute bottom-[calc(100vh-12rem)]"></div>
        </>
      ) : (
        <div className="col-span-full flex min-h-80 flex-col items-center justify-center gap-4">
          <ListingsEmptySvg />
          <p className="text-xl font-semibold">
            We haven&apos;t uploaded our properties for this location yet 
          </p>
          <p className="text-balance text-center text-muted-foreground">
            However we have <b>50+ hosts</b> in our network with properties in this area 
          </p>

          <div className="flex w-64 flex-col gap-2">
            <Button variant="secondary" asChild>
              <Link href="/">Get Deals for {locationName}</Link>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
