  import { useCallback, useRef, useState } from "react";
  
  import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
  import { LoadingProvider } from "@/components/unclaimed-offers/UnclaimedMapLoadingContext";
import SearchPropertiesMap, { MapBoundary } from "../landing-page/search/SearchPropertiesMap";

export default function TestComponent()
 {
  const fetchNextPageRef = useRef<(() => Promise<void>) | null>(null);
  const setFunctionRef = useCallback((ref: (() => Promise<void>) | null) => {
    fetchNextPageRef.current = ref;
  }, []);
  const [mapBoundaries, setMapBoundaries] = useState<MapBoundary | null>(null);

  return (
    <LoadingProvider>
    <div className="h-screen-minus-header-n-footer sm:h-screen-minus-header-n-footer-n-searchbar flex w-full">
      <div className="max-w-[1200px] w-2/3 h-full px-6">
        <UnclaimedOfferCards
          setFunctionRef={setFunctionRef}
          mapBoundaries={mapBoundaries}
        />
      </div>
      <div className="hidden h-full w-full md:block">
        <SearchPropertiesMap
          setFunctionRef={setFunctionRef}
          mapBoundaries={mapBoundaries}
          setMapBoundaries={setMapBoundaries}
        />
      </div>
    </div>
    </LoadingProvider>
  );
}
