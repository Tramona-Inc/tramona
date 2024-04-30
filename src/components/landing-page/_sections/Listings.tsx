import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useIntersection } from "@mantine/hooks"; // a hook that we'll be using to detect when the user reaches the bottom of the page
import { useEffect, useMemo, useRef } from "react";
import HomeOfferCard from "../HomeOfferCard";

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
      lat: filter.lat ?? 0,
      long: filter.long ?? 0,
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

  return (
    <section className="grid grid-cols-1 gap-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {isLoading ? (
        // if we're still fetching the initial currentProperties, display the loader
        <div className="col-span-full flex justify-center overflow-y-hidden">
          <Spinner />
        </div>
      ) : !!currentProperties.length ? (
        // if there are currentProperties to show, display them
        <>
          {currentProperties.map((property, i) =>
            i === currentProperties.length - 1 ? (
              <div ref={ref} key={property.id} className="cursor-pointer">
                <HomeOfferCard key={property.id} property={property} />
              </div>
            ) : (
              <div key={property.id} className="cursor-pointer">
                <HomeOfferCard property={property} />
              </div>
            ),
          )}

          {isFetchingNextPage && (
            <div className="flex justify-center overflow-y-hidden">
              <Spinner />
            </div>
          )}

          {!isFetchingNextPage &&
            properties?.pages.length &&
            !properties.pages[properties.pages.length - 1]?.nextCursor && (
              <div className="text-center opacity-60">
                <p className="text-xs md:text-sm">No more properties to load</p>
              </div>
            )}
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
