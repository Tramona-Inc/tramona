import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";

import SearchPropertiesMap from "./SearchPropertiesMap";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import Head from "next/head";
import { useState, useEffect } from "react";
import SearchListings from "./SearchListings";
import Banner from "@/components/landing-page/Banner";
import CitiesFilter from "@/components/landing-page/CitiesFilter";
import { useMaybeSendUnsentRequests } from "@/utils/useMaybeSendUnsentRequests";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/utils";
import { SearchIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import DynamicDesktopSearchBar from "./DynamicDesktopSearchBar";

import { useMediaQuery } from "@/components/_utils/useMediaQuery";

import { MobileSearchTab } from "../SearchBars/MobileSearchTab";
//check to see if there is no cities filter and clear it on, if no maps dont exist
import { useCitiesFilter } from "@/utils/store/cities-filter";
import MobileSearchListings from "./MobileSearchListings";
import MobileFilterBar from "./MobileFilterBar";
import { AdjustedPropertiesProvider } from "./AdjustedPropertiesContext";

export default function SearchPage() {
  const filter = useCitiesFilter((state) => state.filter);
  const setFilter = useCitiesFilter((state) => state.setFilter);
  //onLoad erase all filters
  useEffect(() => {
    setFilter(undefined);
  }, []);
  const isFilterUndefined = filter === undefined;

  useMaybeSendUnsentRequests();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: isPropertyBids, error: propertyBidsError } =
    api.biddings.getAllPropertyBids.useQuery(undefined, {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  const { data: isBucketListProperty, error: bucketListError } =
    api.profile.getAllPropertiesInBucketList.useQuery(undefined, {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  const setInitialBids = useBidding((state) => state.setInitialBids);

  const setInitialBucketList = useBidding(
    (state) => state.setInitialBucketList,
  );

  useEffect(() => {
    if (!propertyBidsError || !bucketListError) {
      setInitialBids(isPropertyBids ?? []);
      setInitialBucketList(isBucketListProperty ?? []);
    }
  }, [
    isPropertyBids,
    propertyBidsError,
    bucketListError,
    setInitialBids,
    isBucketListProperty,
    setInitialBucketList,
  ]);

  return (
    <VerificationProvider>
      <AdjustedPropertiesProvider>
        <Head>
          <title>Tramona</title>
        </Head>
        <div className="relative mb-20 overflow-x-hidden bg-white">
          <VerificationBanner />
          {!isMobile ? (
            <div className="mt-32 flex flex-col items-center justify-center gap-y-8 px-4">
              <DynamicDesktopSearchBar />
              <div className="space-y-4">
                <CitiesFilter />
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3 lg:grid-cols-5">
                  <div
                    className={`col-span-1  ${isFilterUndefined ? "md:col-span-3 lg:col-span-5" : "md:col-span-2 lg:col-span-3"}`}
                  >
                    <SearchListings isFilterUndefined={isFilterUndefined} />
                  </div>
                  {!isFilterUndefined && (
                    <div className="col-span-1 max-h-[1000px] md:col-span-1 lg:col-span-2">
                      <div className="sticky top-16">
                        <SearchPropertiesMap
                          isFilterUndefined={isFilterUndefined}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col">
              <MobileJustSearch />
              <div className="my-1 mt-16">
                <MobileFilterBar />
              </div>
              <div>
                <SearchPropertiesMap isFilterUndefined={isFilterUndefined} />
              </div>
              <MobileSearchListings isFilterUndefined={isFilterUndefined} />
            </div>
          )}
        </div>
      </AdjustedPropertiesProvider>
    </VerificationProvider>
  );
}

const VerificationBanner = () => {
  const { showBanner, status, setShowVerificationBanner } = useVerification();
  const handleCloseBanner = () => {
    setShowVerificationBanner(false);
  };

  if (!showBanner || (status !== "true" && status !== "pending")) return null;
  return <Banner type={status} onClose={handleCloseBanner} />;
};

function MobileJustSearch() {
  const [mode, setMode] = useState("search");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="fixed top-14 z-30 w-full">
        <div className="z-30 flex flex-row items-center gap-x-3 rounded-lg bg-white px-3 py-4  text-center font-semibold text-muted-foreground shadow-md">
          <SearchIcon />
          Search
        </div>
      </SheetTrigger>
      <SheetContent side="top" className="h-full">
        <SheetHeader>
          <div className="flex h-full w-full items-center justify-center gap-2 pb-5">
            <Button
              variant="link"
              className={cn(mode === "search" && "underline")}
              onClick={() => setMode("search")}
            >
              Search
            </Button>
          </div>
        </SheetHeader>
        {mode === "search" && (
          <MobileSearchTab closeSheet={() => setOpen(false)} />
        )}
      </SheetContent>
    </Sheet>
  );
}
