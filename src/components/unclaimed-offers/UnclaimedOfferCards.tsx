import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import {
  formatDateRange,
  formatCurrency,
  plural,
  getNumNights,
} from "@/utils/utils";
import { InfoIcon, TrashIcon, ExternalLink, CirclePlus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchPropertiesMap from "../landing-page/search/SearchPropertiesMap";
import { useCitiesFilter } from "@/utils/store/cities-filter";
import { AdjustedPropertiesProvider } from "../landing-page/search/AdjustedPropertiesContext";


import AddUnclaimedOffer from "./AddUnclaimedOffer";
import UnclaimedOffersMap from "./UnclaimedOfferMap";
export type UnMatchedOffers =
  RouterOutputs["offers"]["getAllUnmatchedOffers"][number];

export default function UnclaimedOfferCard() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const {
    data: unMatchedOffers,
    isLoading: isLoadingOffers,
  } = api.offers.getAllUnmatchedOffers.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: 0,
  });

  const propertyIds = useMemo(() => 
    unMatchedOffers?.map(offer => offer.propertyId) ?? [], 
    [unMatchedOffers]
  );

  const {
    data: propertyDetails,
    isLoading: isLoadingProperties,
  } = api.properties.getPropertiesById.useQuery(propertyIds, {
    enabled: propertyIds.length > 0,
  });

  const isLoading = isLoadingOffers || isLoadingProperties;

  const mapMarkers = useMemo(() => 
    propertyDetails?.map(property => ({
      id: property.id.toString(),
      location: { lat: property.latitude, lng: property.longitude },
      propertyName: property.name,
      price: property.originalNightlyPrice,
      image: property.imageUrls[0] ?? "",
    })) ?? [],
    [propertyDetails]
  );
  const { data: session } = useSession();

  const [isFilterUndefined, setIsFilterUndefined] = useState(true);
  const fetchNextPageRef = useRef<(() => Promise<void>) | null>(null);

  const setFunctionRef = useCallback((ref: (() => Promise<void>) | null) => {
    console.log("setFunctionRef called with:", ref);
    fetchNextPageRef.current = ref;
    console.log("fetchNextPageRef updated:", fetchNextPageRef.current);
  }, []);

  const filters = useCitiesFilter((state) => state);

  useEffect(() => {
    setIsFilterUndefined(!filters.filter);
  }, [filters.filter]);

  const totalPages = useMemo(
    () =>
      unMatchedOffers ? Math.ceil(unMatchedOffers.length / itemsPerPage) : 0,
    [unMatchedOffers, itemsPerPage],
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`?page=${page}`, undefined, { shallow: true });
  };

  const paginatedOffers = useMemo(() => {
    if (!unMatchedOffers) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return unMatchedOffers.slice(startIndex, endIndex);
  }, [unMatchedOffers, currentPage, itemsPerPage]);

  useEffect(() => {
    const page = Number(router.query.page) || 1;
    setCurrentPage(page);
  }, [router.query.page]);

  useEffect(() => {
    console.log("Component re-rendered. Current state:");
    console.log("isLoading:", isLoading);
    console.log("All unmatched offers:", unMatchedOffers?.length ?? "Not loaded yet");
    console.log("Paginated offers:", paginatedOffers.length);
    console.log("Current page:", currentPage);
    console.log("Total pages:", totalPages);

    if (!isLoading && unMatchedOffers) {
      const offerIds = new Set();
      paginatedOffers.forEach((offer, index) => {
        console.log(`Offer ${index + 1} ID:`, offer.id);
        offerIds.add(offer.id);
      });
      console.log("Unique offer IDs:", offerIds.size);
    }
  }, [unMatchedOffers, paginatedOffers, currentPage, totalPages, isLoading]);


  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`?page=${i}`}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      // ... (rest of the pagination logic)
    }

    return items;
  };

  return (
    <div className="flex max-w-7xl">
      <div className="max-w-2/3 mx-auto px-4 sm:px-6 lg:px-8">
        {!isLoading ? (
          paginatedOffers.length > 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginatedOffers.map((offer) => (
                  <React.Fragment key={offer.id}>
                    <UnMatchedPropertyCard offer={offer} />
                  </React.Fragment>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={`?page=${Math.max(1, currentPage - 1)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(Math.max(1, currentPage - 1));
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(
                            Math.min(totalPages, currentPage + 1),
                          );
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
              {session?.user.role === "admin" && (
                <div className="mt-20 rounded-xl border-4 p-4">
                  <AddUnclaimedOffer />
                </div>
              )}
            </div>
          ) : (
            <div>Sorry, we currently don&apos;t have any unmatched offers.</div>
          )
        ) : (
          <div className="flex items-center justify-center">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(24)].map((_, index) => (
                <div key={index} className="aspect-[4/5] w-full">
                  <Skeleton className="h-full w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-[1000px] h-[1000px]">
      {unMatchedOffers && <UnclaimedOffersMap unMatchedOffers={unMatchedOffers} />}
      </div>
    </div>
  );
}

function UnMatchedPropertyCard({ offer }: { offer: UnMatchedOffers }) {
  return (
    <Link href={`/public-offer/${offer.id}`}>
      <div className="flex aspect-[4/5] w-full cursor-pointer flex-col overflow-hidden rounded-xl">
        <div className="relative flex-grow">
          <Image
            src={offer.property.imageUrls[0] ?? ""}
            alt=""
            layout="fill"
            objectFit="cover"
            className="rounded-t-xl"
          />
        </div>
        <div className="flex flex-col space-y-1 bg-white p-4">
          <div className="line-clamp-1 overflow-ellipsis font-bold">
            {offer.property.name}
          </div>
          <div className="flex items-center text-zinc-500">
            {formatDateRange(offer.checkIn, offer.checkOut)}
          </div>
          <div className="flex">
            <div className="flex items-center text-zinc-500">
              {plural(offer.property.maxNumGuests, "Guest")}&nbsp;
            </div>
          </div>
          <div className="flex items-center text-center font-semibold">
            <div className="mr-3">
              {formatCurrency(offer.property.originalNightlyPrice!)}
              &nbsp;night
            </div>
            <div className="line-through">
              airbnb price&nbsp;
              {formatCurrency(
                offer.property.originalNightlyPrice! * AVG_AIRBNB_MARKUP,
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
