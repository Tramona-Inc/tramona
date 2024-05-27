import ListingsEmptySvg from "@/components/_common/EmptyStateSvg/ListingsEmptySvg";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useIntersection } from "@mantine/hooks"; // a hook that we'll be using to detect when the user reaches the bottom of the page
import { FilterXIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import HomeOfferCard from "../HomeOfferCard";

function NoProperties() {
  const filters = useCitiesFilter((state) => state);

  return (
    <div className="col-span-full flex min-h-80 flex-col items-center justify-center gap-4">
      <ListingsEmptySvg />
      <p className="text-xl font-semibold">
        Sorry, we couldn&apos;t find any properties for your search
      </p>
      <p className="text-balance text-center text-muted-foreground">
        Clear filters and try again, or <b>request a deal</b> above to have us
        connect you with our host network!
      </p>

      <div className="flex w-64 flex-col gap-2">
        <Button variant="secondary" onClick={() => filters.clearFilter()}>
          <FilterXIcon className="size-5" />
          Clear filters
        </Button>
      </div>
    </div>
  );
}

export default function Listings() {
  const filters = useCitiesFilter((state) => state);

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
      // the cursor from where to start fetching thecurrentProperties
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  // a ref to the viewport
  const viewportRef = useRef<HTMLDivElement>(null);
  // a ref to the last property element
  const { entry, ref } = useIntersection({
    root: viewportRef.current,
    threshold: 0.5,
  });

  useEffect(() => {
    // if the user reaches the bottom of the page, and there are more currentProperties to fetch, fetch them
    if (
      entry?.isIntersecting &&
      properties?.pages.length &&
      properties.pages[properties.pages.length - 1]?.nextCursor
    ) {
      void fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  // memoize the currentProperties, so that they don't get re-rendered on every re-render
  const currentProperties = useMemo(
    () => properties?.pages.flatMap((page) => page.data) ?? [],
    [properties],
  );

  const skeletons = Array.from({ length: 11 }, (_, index) => (
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
    <section className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {isLoading ? (
        // if we're still fetching the initial currentProperties, display the loader
        <>{skeletons}</>
      ) : !!currentProperties.length ? (
        // if there are currentProperties to show, display them
        <>
          {currentProperties.map((property, i) => (
            <>
              {i === currentProperties.length - 1 ? (
                <div ref={ref} key={property.id}>
                  <HomeOfferCard key={property.id} property={property} />
                </div>
              ) : (
                <div key={property.id}>
                  <HomeOfferCard key={property.id} property={property} />
                </div>
              )}
            </>
          ))}
          {isFetchingNextPage && <>{skeletons}</>}
          {!isFetchingNextPage &&
            properties?.pages.length &&
            !properties.pages[properties.pages.length - 1]?.nextCursor && (
              <NoProperties />
            )}
        </>
      ) : (
        <NoProperties />
      )}
    </section>
  );
}
