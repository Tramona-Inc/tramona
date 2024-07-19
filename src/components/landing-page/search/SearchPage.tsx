import {
  VerificationProvider,
  useVerification,
} from "@/components/_utils/VerificationContext";
import SearchPropertiesMap from "./SearchPropertiesMap";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import SearchListings from "./SearchListings";
import Banner from "@/components/landing-page/Banner";
import CitiesFilter, {
  FiltersBtn,
} from "@/components/landing-page/CitiesFilter";
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
import { MobileSearchTab } from "../SearchBars/MobileSearchTab";
//check to see if there is no cities filter and clear it on, if no maps dont exist
import { useCitiesFilter } from "@/utils/store/cities-filter";
import MobileSearchListings from "./MobileSearchListings";
import MobileFilterBar from "./MobileFilterBar";
import { AdjustedPropertiesProvider } from "./AdjustedPropertiesContext";
import { useRouter } from "next/router";
import { cities } from "../cities";

export default function SearchPage() {
  const filter = useCitiesFilter((state) => state.filter);
  const setFilter = useCitiesFilter((state) => state.setFilter);
  const router = useRouter();

  useEffect(() => {
    const city =
      typeof router.query.city === "string"
        ? cities.find((c) => c.id === router.query.city)
        : undefined;

    setFilter(city);
  }, [router.query.city, setFilter]);
  const isFilterUndefined = filter === undefined;

  useMaybeSendUnsentRequests();

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
    isPropertyBids,
    setInitialBucketList,
  ]);
  //we are passing holding the fetchNextPageOfAdjustedProperties to here this is the parent component
  //SearchListings will call it SearchPropertiesMap will set it after the call
  const functionRef = useRef<() => void>(null);

  const setFunctionRef = (func: () => void) => {
    (functionRef as React.MutableRefObject<(() => void) | null>).current = func;
  };

  const callFetchAdjustedPropertiesFunction = () => {
    if (functionRef.current) {
      functionRef.current();
    }
  };

  return (
    <VerificationProvider>
      <AdjustedPropertiesProvider>
        <Head>
          <title>Explore | Tramona</title>
        </Head>
        <div className="relative mb-20 bg-white">
          <VerificationBanner />
          <div className="mt-12 hidden space-y-4 px-4 md:block">
            <div className="item-center flex justify-center text-2xl font-black">
              Explore popular destinations
            </div>
            <p className="text-balance text-center text-lg">
              Search through our properties, send an offer, and the host will
              accept, deny or counter your offer in 24 hours or less.
            </p>
            <div className="sticky top-16 z-30 bg-white">
              <DynamicDesktopSearchBar />
              <div className="flex items-center gap-2 border-b">
                <div className="w-full">
                  <CitiesFilter />
                </div>
                <FiltersBtn />
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3 lg:grid-cols-5">
                <div
                  className={`col-span-1 ${isFilterUndefined ? "md:col-span-3 lg:col-span-5" : "md:col-span-2 lg:col-span-3"}`}
                >
                  <SearchListings
                    isFilterUndefined={isFilterUndefined}
                    callSiblingFunction={callFetchAdjustedPropertiesFunction}
                  />
                </div>
                {!isFilterUndefined && (
                  <div className="col-span-1 md:col-span-1 lg:col-span-2">
                    <div className="sticky top-16">
                      <SearchPropertiesMap
                        isFilterUndefined={isFilterUndefined}
                        setFunctionRef={setFunctionRef}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <div className="mt-4 space-y-2 p-4">
              <div className="text-center text-3xl font-bold">
                Explore popular destinations
              </div>
              <div className="text-pretty text-center">
                Search through our properties, send an offer, and the host will
                accept, deny or counter your offer in 24 hours or less.
              </div>
            </div>
            <div className="relative flex flex-col">
              <MobileJustSearch />
              <div className="my-1 mt-16">
                <MobileFilterBar />
              </div>
              <div>
                <SearchPropertiesMap
                  isFilterUndefined={isFilterUndefined}
                  setFunctionRef={setFunctionRef}
                />
              </div>
              <MobileSearchListings
                isFilterUndefined={isFilterUndefined}
                callSiblingFunction={callFetchAdjustedPropertiesFunction}
              />
            </div>
          </div>
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
      <SheetTrigger className="sticky top-[calc(var(--header-height)+4px)] z-30 p-4">
        <div className="z-30 flex flex-row items-center gap-x-3 rounded-lg border bg-white px-3 py-4 text-center font-semibold text-muted-foreground shadow-md">
          <SearchIcon />
          Search properties to send offers on
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
