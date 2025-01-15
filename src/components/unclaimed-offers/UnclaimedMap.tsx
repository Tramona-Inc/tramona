import { useEffect, useState } from "react";

import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
import { LoadingProvider } from "@/components/unclaimed-offers/UnclaimedMapLoadingContext";

// import type { fetchNextPageOfAdjustedPropertiesType } from "@/components/landing-page/search/SearchPropertiesMap";
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
  const { isSearching } = useAdjustedProperties();

  // const fetchNextPageRef = useRef<FetchNextPageRefFunction | null>(null);

  // const setFunctionRef = useCallback((ref: FetchNextPageRefFunction) => {
  //   fetchNextPageRef.current = ref;
  // }, []);

  return (
    <LoadingProvider>
      <div className="w-full px-4 sm:px-16">
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
            <UnclaimedOfferCards />
          </div>
        )}
      </div>
    </LoadingProvider>
  );
}
