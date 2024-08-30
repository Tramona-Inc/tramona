import { useCallback, useRef, useState } from "react";

import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
import { LoadingProvider } from "@/components/unclaimed-offers/UnclaimedMapLoadingContext";
import SearchPropertiesMap, {
  MapBoundary,
} from "../landing-page/search/SearchPropertiesMap";
import { Button } from "../ui/button";

export default function TestComponent() {
  const fetchNextPageRef = useRef<(() => Promise<void>) | null>(null);
  const setFunctionRef = useCallback((ref: (() => Promise<void>) | null) => {
    fetchNextPageRef.current = ref;
  }, []);
  const [mapBoundaries, setMapBoundaries] = useState<MapBoundary | null>(null);
  const [showMap, setShowMap] = useState(false);

  const toggleView = () => setShowMap(!showMap);

  return (
    <LoadingProvider>
      <div className="sm:h-screen-minus-header-n-footer-n-searchbar flex h-screen-minus-header-n-footer w-full">
        <div
          className={`h-full w-full max-w-7xl px-6 md:w-2/3 ${showMap ? 'hidden' : 'h-full w-full'}`}
        >
          <UnclaimedOfferCards
            mapBoundaries={mapBoundaries}
          />
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 transform md:hidden rounded-full">
            <Button size="sm" onClick={toggleView} className="text-xs">Show Map</Button>
          </div>
        </div>
        <div
          className={`h-full md:flex md:w-1/3 md:flex-grow ${showMap ? 'flex h-full w-full md:hidden' : 'hidden'}`}
        >
          <SearchPropertiesMap
            setFunctionRef={setFunctionRef}
            mapBoundaries={mapBoundaries}
            setMapBoundaries={setMapBoundaries}
          />
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 transform md:hidden rounded-full">
            <Button size={"sm"} onClick={toggleView} className="text-xs">Show List</Button>
          </div>
        </div>
      </div>
    </LoadingProvider>
  );
}
