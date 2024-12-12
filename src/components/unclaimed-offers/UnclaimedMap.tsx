import { useCallback, useEffect, useRef, useState } from "react";

import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
import { LoadingProvider } from "@/components/unclaimed-offers/UnclaimedMapLoadingContext";

// import type { fetchNextPageOfAdjustedPropertiesType } from "@/components/landing-page/search/SearchPropertiesMap";
import type { InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useAdjustedProperties } from "../landing-page/search/AdjustedPropertiesContext";
import { useCitiesFilter } from "@/utils/store/cities-filter";

export type MapBoundary = {
  north: number;
  south: number;
  east: number;
  west: number;
};

// type FetchNextPageRefFunction = () => Promise<
//   InfiniteQueryObserverResult<fetchNextPageOfAdjustedPropertiesType>
// >;

export default function UnclaimedMap() {
  const filters = useCitiesFilter((state) => state);
  // const { setIsLoading } = useLoading();
  const { setAdjustedProperties, isSearching } = useAdjustedProperties();

  // const fetchNextPageRef = useRef<FetchNextPageRefFunction | null>(null);

  // const setFunctionRef = useCallback((ref: FetchNextPageRefFunction) => {
  //   fetchNextPageRef.current = ref;
  // }, []);

  const [mapBoundaries, setMapBoundaries] = useState<MapBoundary | null>(null);
  const [showMap, setShowMap] = useState(false);

  const toggleView = () => setShowMap(!showMap);

  useEffect(() => {
    if (filters.filter) {
      const { lat, long } = filters.filter;
      const offset = 0.1; // Adjust this value to change the size of the simulated map area
      setMapBoundaries({
        north: lat + offset,
        south: lat - offset,
        east: long + offset,
        west: long - offset,
      });
    }
  }, [filters.filter]);

  // const {
  //   data: fetchedAdjustedProperties,
  //   fetchNextPage: fetchNextPageOfAdjustedProperties,
  //   isLoading,
  //   isFetching,
  // } = api.properties.getByBoundaryInfiniteScroll.useInfiniteQuery(
  //   {
  //     boundaries: mapBoundaries,
  //     latLngPoint: filters.filter ? {
  //       lat: filters.filter.lat,
  //       lng: filters.filter.long,
  //     } : undefined,
  //     radius: filters.radius,
  //   },
  //   {
  //     getNextPageParam: (lastPage) => lastPage.nextCursor,
  //     refetchOnWindowFocus: false,
  //   },
  // );

  // // useEffect(() => {
  // //   setIsLoading(isLoading || isFetching);
  // // }, [isLoading, isFetching, setIsLoading]);

  // useEffect(() => {
  //   if (fetchedAdjustedProperties) {
  //     console.log("setting adjusted properties");
  //     setAdjustedProperties(fetchedAdjustedProperties);
  //   }
  // }, [fetchedAdjustedProperties, setAdjustedProperties]);

  // useEffect(() => {
  //   console.log("setting function ref from UnclaimedMap");
  //   setFunctionRef(fetchNextPageOfAdjustedProperties);
  // }, [fetchNextPageOfAdjustedProperties, setFunctionRef]);

  return (
    <LoadingProvider>
      <div className="w-full">
        <div className={`w-full ${showMap ? "hidden" : "w-full"}`}>
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primaryGreen border-t-transparent"></div>
              <p className="text-lg font-semibold text-gray-700">
                Finding your perfect stay...
              </p>
              <p className="mt-2 text-sm text-gray-500">
                We&apos;re searching for the best offers just for you
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <UnclaimedOfferCards mapBoundaries={mapBoundaries} />
            </div>
          )}
        </div>
      </div>
    </LoadingProvider>
  );
}
