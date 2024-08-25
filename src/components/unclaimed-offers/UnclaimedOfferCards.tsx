import Image from "next/image";
import { Button } from "@/components/ui/button";
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
// import {
//   InfoIcon,
//   TrashIcon,
//   ExternalLink,
//   CirclePlus,
//   Star,
// } from "lucide-react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
  const { data: unMatchedOffers, isLoading: isLoadingOffers } =
    api.offers.getAllUnmatchedOffers.useQuery(undefined, {
      staleTime: Infinity,
      cacheTime: 0,
    });

  const propertyIds = useMemo(
    () => unMatchedOffers?.map((offer) => offer.propertyId) ?? [],
    [unMatchedOffers],
  );

  const { data: propertyDetails, isLoading: isLoadingProperties } =
    api.properties.getPropertiesById.useQuery(propertyIds, {
      enabled: propertyIds.length > 0,
    });

  const isLoading = isLoadingOffers || isLoadingProperties;

  const mapMarkers = useMemo(
    () =>
      propertyDetails?.map((property) => ({
        id: property.id.toString(),
        location: { lat: property.latitude, lng: property.longitude },
        propertyName: property.name,
        price: property.originalNightlyPrice,
        image: property.imageUrls[0] ?? "",
      })) ?? [],
    [propertyDetails],
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
    console.log(
      "All unmatched offers:",
      unMatchedOffers?.length ?? "Not loaded yet",
    );
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
    <div className="flex h-full w-full pt-24">
      <div className="max-w-2/3 mr-auto h-full overflow-y-scroll px-6 scrollbar-hide">
        {!isLoading ? (
          paginatedOffers.length > 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="grid w-full gap-x-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
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
      <div className="min-w-1/3 h-full w-full hidden lg:block">
        {unMatchedOffers && (
          <UnclaimedOffersMap unMatchedOffers={unMatchedOffers} />
        )}
      </div>
    </div>
  );
}

export function UnMatchedPropertyCard({ offer }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < offer.property.imageUrls.length - 1) {
      setCurrentImageIndex(prevIndex => prevIndex + 1);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prevIndex => prevIndex - 1);
    }
  };

  return (
    <Link href={`/public-offer/${offer.id}`} className="block">
      <div 
        className="flex aspect-[3/4] w-full cursor-pointer flex-col overflow-hidden rounded-xl  relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-3/5 overflow-hidden">
          <div 
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {offer.property.imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative h-full w-full flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={`Property image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
          <div 
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {currentImageIndex > 0 && (
              <Button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full transition-all duration-200 hover:bg-white hover:bg-opacity-80 z-10"
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </Button>
            )}
            {currentImageIndex < offer.property.imageUrls.length - 1 && (
              <Button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full transition-all duration-200 hover:bg-white hover:bg-opacity-80 z-10"
              >
                <ChevronRight size={24} className="text-gray-800" />
              </Button>
            )}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-10">
            {offer.property.imageUrls.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'bg-white w-2' : 'bg-white bg-opacity-50 w-1.5'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex h-2/5 flex-col space-y-2 p-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 overflow-hidden overflow-ellipsis font-bold">
                  {offer.property.name}
                </div>
              </div>
              <div className="ml-2 flex items-center whitespace-nowrap space-x-1">
                <Star fill="gold" size={12} />
                <div>{offer.property.avgRating?.toFixed(2) ?? "New"}</div>
                <div>({offer.property.numRatings ?? ""})</div>
              </div>
            </div>
            <div className="text-sm text-zinc-500">
              {formatDateRange(offer.checkIn, offer.checkOut)}
            </div>
            <div className="text-sm text-zinc-500">
              {plural(offer.property.maxNumGuests, "Guest")}
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm font-semibold">
            <div>
              {formatCurrency(offer.property.originalNightlyPrice)}
              &nbsp;night
            </div>
            <div className="text-xs line-through text-zinc-500">
              airbnb&nbsp;{formatCurrency(
                offer.property.originalNightlyPrice * AVG_AIRBNB_MARKUP
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}