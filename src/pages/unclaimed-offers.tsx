import MainLayout from "@/components/_common/Layout/MainLayout";
import { AdjustedPropertiesProvider } from "@/components/landing-page/search/AdjustedPropertiesContext";
import DynamicDesktopSearchBar from "@/components/landing-page/search/DynamicDesktopSearchBar";
import SearchPropertiesMap from "@/components/landing-page/search/SearchPropertiesMap";
import { Button } from "@/components/ui/button";
import UnclaimedHeader from "@/components/unclaimed-offers/UnclaimedHeader";
// import UnclaimedOfferCard from "@/components/unclaimed-offers/UnclaimedOfferCards";
import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
import Link from "next/link";
import React, { useCallback, useRef } from "react";

export type MapBoundary = {
  north: number;
  south: number;
  east: number;
  west: number;
};
export default function Page() {
  const [isFilterUndefined, setIsFilterUndefined] = React.useState(true);
  const fetchNextPageRef = useRef<(() => Promise<void>) | null>(null);
  const setFunctionRef = useCallback((ref: (() => Promise<void>) | null) => {
    console.log("setFunctionRef called with:", ref);
    fetchNextPageRef.current = ref;
    console.log("fetchNextPageRef updated:", fetchNextPageRef.current);
  }, []);
  
  const [mapBoundaries, setMapBoundaries] = React.useState<MapBoundary | null>(null);
  
  return (
    <MainLayout>
      <AdjustedPropertiesProvider>
        <div className="h-full w-full flex-col">
          <div className="h-searchbar-height sticky top-header-height z-10 hidden justify-center sm:flex">
            <DynamicDesktopSearchBar />
          </div>
          <div className="sm:h-screen-minus-header-n-footer-n-searchbar mt-16 flex h-screen-minus-header-n-footer w-full">
            <div className="max-w-2/3 mr-auto h-full overflow-y-scroll px-6 scrollbar-hide">
              <UnclaimedOfferCards  setFunctionRef={setFunctionRef} isFilterUndefined={isFilterUndefined} setIsFilterUndefined={setIsFilterUndefined} mapBoundaries={mapBoundaries}/>
            </div>
            <div className="min-w-1/3 hidden h-full w-full lg:block">
              <SearchPropertiesMap
                isFilterUndefined={isFilterUndefined}
                setFunctionRef={setFunctionRef}
                mapBoundaries={mapBoundaries}
                setMapBoundaries={setMapBoundaries}
              />
            </div>
          </div>
        </div>
      </AdjustedPropertiesProvider>
    </MainLayout>
  );
}
