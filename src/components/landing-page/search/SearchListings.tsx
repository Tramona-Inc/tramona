import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useIntersection } from "@mantine/hooks"; // a hook that we'll be using to detect when the user reaches the bottom of the page
import { useEffect, useMemo, useRef } from "react";
import HomeOfferCard from "../HomeOfferCard";
import { Button } from "@/components/ui/button";
import ListingsEmptySvg from "@/components/_common/EmptyStateSvg/ListingsEmptySvg";
import { FilterXIcon } from "lucide-react";
import { useAdjustedProperties } from "./AdjustedPropertiesContext";

export default function SearchListings({
  isFilterUndefined,
}: {
  isFilterUndefined: boolean;
}) {
  const filters = useCitiesFilter((state) => state);

  // The properties that the map is currently displaying
  const { adjustedProperties } = useAdjustedProperties();

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
    },
  );

  // a ref to the last property element
  const { entry, ref } = useIntersection({
    root: null, // null means observing in the context of the viewport
    threshold: 1,
  });

  useEffect(() => {
    // if the user reaches the bottom of the page, and there are more properties to fetch, fetch them
    if (
      entry?.isIntersecting &&
      properties?.pages.length &&
      properties.pages[properties.pages.length - 1]?.nextCursor
    ) {
      void fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  // memoize the properties, so that they don't get re-rendered on every re-render
  const currentProperties = useMemo(() => {
    if (adjustedProperties !== null) {
      return adjustedProperties.pages.flatMap((page) => page.data) ?? [];
    }
    return properties?.pages.flatMap((page) => page.data) ?? [];
  }, [adjustedProperties, properties]);

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
    <section
      className={`relative grid grid-cols-1 gap-10 gap-y-10 sm:grid-cols-2 ${isFilterUndefined ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" : "lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"}`}
    >
      {isLoading ? (
        // if we're still fetching the initial properties, display the loader
        <>{skeletons}</>
      ) : currentProperties.length > 0 ? (
        // if there are properties to show, display them
        <>
          {currentProperties.map((property) => (
            <HomeOfferCard key={property.id} property={property} />
          ))}
          {isFetchingNextPage && skeletons}
          <div ref={ref} className="h-1 w-full"></div>
        </>
      ) : (
        <div className="col-span-full flex min-h-80 flex-col items-center justify-center gap-4">
          <ListingsEmptySvg />
          <p className="text-xl font-semibold">
            Sorry, we couldn&apos;t find any properties for your search
          </p>
          <p className="text-balance text-center text-muted-foreground">
            Clear filters and try again, or <b>request a deal</b> above to have
            us connect you with our host network!
          </p>

          <div className="flex w-64 flex-col gap-2">
            <Button variant="secondary" onClick={() => filters.clearFilter()}>
              <FilterXIcon className="size-5" />
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
