import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useIntersection } from "@mantine/hooks"; // a hook that we'll be using to detect when the user reaches the bottom of the page
import { useEffect, useMemo, useRef } from "react";
import HomeOfferCard from "../HomeOfferCard";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function Listings() {
  const filter = useCitiesFilter((state) => state.filter);
  const { beds, bedrooms, bathrooms, roomType, houseRules } = useCitiesFilter(
    (state) => state,
  );

  const {
    data: properties,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
  } = api.properties.getAllInfiniteScroll.useInfiniteQuery(
    {
      // city: filter.id,
      roomType: roomType,
      beds: beds,
      bathrooms: bathrooms,
      bedrooms: bedrooms,
      houseRules: houseRules,
      lat: filter.lat,
      long: filter.long,
      radius: 5,
    },
    {
      // the cursor from where to start fetching thecurrentProperties
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  // a ref to the viewport
  const viewportRef = useRef<HTMLDivElement>(null);
  // a ref to the last property element
  const { entry, ref } = useIntersection({
    root: viewportRef.current,
    threshold: 1,
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
    <section className="grid grid-cols-1 gap-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {isLoading ? (
        // if we're still fetching the initial currentProperties, display the loader
        <>{skeletons}</>
      ) : !!currentProperties.length ? (
        // if there are currentProperties to show, display them
        <>
          {currentProperties.map((property, i) => (
            <div
              ref={i === currentProperties.length - 1 ? ref : undefined}
              key={property.id}
            >
              <HomeOfferCard property={property} />
            </div>
          ))}

          {isFetchingNextPage && skeletons}
        </>
      ) : (
        // if there are no properties to show, display a message
        <div className="flex justify-center">
          <p className="text-sm text-white/60">No properties to show</p>
        </div>
      )}
    </section>
  );
}
