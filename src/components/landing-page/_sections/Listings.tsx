import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { useIntersection } from "@mantine/hooks"; // a hook that we'll be using to detect when the user reaches the bottom of the page
import { useEffect, useMemo, useRef } from "react";
import HomeOfferCard from "../HomeOfferCard";
import { Skeleton } from "@/components/ui/skeleton";

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
  const divArray = Array.from({ length: 18 }, (_, index) => (
    // TODO: move this down to where spinner is
    <div key={index} className="">
      <Skeleton className="h-[250px] w-[230px] rounded-xl" />
      <div className="ml-2 mt-2 flex  flex-col space-y-2">
        <Skeleton className="  h-5 w-[210px]" />
        <Skeleton className="h-5 w-[180px]" />
        <Skeleton className="h-5 w-[180px]" />
      </div>
    </div>
  ));
  return (
    <section className="grid grid-cols-1 gap-10 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {isLoading ? (
        // if we're still fetching the initial currentProperties, display the loader
        <>{divArray}</>
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

          {isFetchingNextPage && (
            <div className="flex justify-center overflow-y-hidden">
              <Spinner />
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
