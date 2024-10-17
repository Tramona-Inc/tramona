import { useCallback, useEffect, useRef, useState } from "react";

import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
import { LoadingProvider, useLoading } from "@/components/unclaimed-offers/UnclaimedMapLoadingContext";
// import SearchPropertiesMap, {
//   MapBoundary,
// } from "../landing-page/search/SearchPropertiesMap";
import { Button } from "../ui/button";
import type { fetchNextPageOfAdjustedPropertiesType } from "@/components/landing-page/search/SearchPropertiesMap";
import type { InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useAdjustedProperties } from "../landing-page/search/AdjustedPropertiesContext";
import { api } from "@/utils/api";
import { useCitiesFilter } from "@/utils/store/cities-filter";

export type MapBoundary = {
  north: number;
  south: number;
  east: number;
  west: number;
};

type FetchNextPageRefFunction = () => Promise<
  InfiniteQueryObserverResult<fetchNextPageOfAdjustedPropertiesType>
>;

export default function UnclaimedMap() {
  const filters = useCitiesFilter((state) => state);
  // const { setIsLoading } = useLoading();
  const { setAdjustedProperties, isSearching } = useAdjustedProperties();

  const fetchNextPageRef = useRef<FetchNextPageRefFunction | null>(null);

  const setFunctionRef = useCallback((ref: FetchNextPageRefFunction) => {
    fetchNextPageRef.current = ref;
  }, []);

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

  const {
    data: fetchedAdjustedProperties,
    fetchNextPage: fetchNextPageOfAdjustedProperties,
    isLoading,
    isFetching,
  } = api.properties.getByBoundaryInfiniteScroll.useInfiniteQuery(
    {
      boundaries: mapBoundaries,
      latLngPoint: filters.filter ? {
        lat: filters.filter.lat,
        lng: filters.filter.long,
      } : undefined,
      radius: filters.radius,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  // useEffect(() => {
  //   setIsLoading(isLoading || isFetching);
  // }, [isLoading, isFetching, setIsLoading]);

  useEffect(() => {
    if (fetchedAdjustedProperties) {
      console.log("setting adjusted properties");
      setAdjustedProperties(fetchedAdjustedProperties);
    }
  }, [fetchedAdjustedProperties, setAdjustedProperties]);

  useEffect(() => {
    console.log("setting function ref from UnclaimedMap");
    setFunctionRef(fetchNextPageOfAdjustedProperties);
  }, [fetchNextPageOfAdjustedProperties, setFunctionRef]);

  
  return (
    <LoadingProvider>
      <div className="flex h-screen-minus-header-n-footer w-full sm:h-screen-minus-header-n-footer-n-searchbar">
        <div
          className={`h-full-minus-searchbar w-full max-w-7xl px-2 mx-auto ${showMap ? "hidden" : "h-full w-full"}`}
        >
          {isSearching ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primaryGreen border-t-transparent"></div>
              <p className="text-lg font-semibold text-gray-700">Finding your perfect stay...</p>
              <p className="mt-2 text-sm text-gray-500">We&quot;re searching for the best offers just for you</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <UnclaimedOfferCards mapBoundaries={mapBoundaries} />
            </div>
          )}
          {/* <div className="fixed bottom-10 left-1/2 -translate-x-1/2 transform rounded-full md:hidden">
            <Button size="sm" onClick={toggleView} className="text-xs">
              Show Map
            </Button>
          </div> */}
        </div>
        {/* <div
          className={`mx-1 h-full md:flex md:w-1/3 md:flex-grow ${showMap ? "flex h-full w-full md:hidden" : "hidden"}`}
        >
          <SearchPropertiesMap
            setFunctionRef={setFunctionRef}
            mapBoundaries={mapBoundaries}
            setMapBoundaries={setMapBoundaries}
          />
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 transform rounded-full md:hidden">
            <Button size={"sm"} onClick={toggleView} className="text-xs">
              Show List
            </Button>
          </div>
        </div> */}
      </div>
    </LoadingProvider>
  );
}
