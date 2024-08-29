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
import { useCitiesFilter } from "@/utils/store/cities-filter";
import {
  AdjustedPropertiesProvider,
  useAdjustedProperties,
} from "../landing-page/search/AdjustedPropertiesContext";
import AddUnclaimedOffer from "./AddUnclaimedOffer";
import { MapBoundary } from "../landing-page/search/SearchPropertiesMap";
import { useLoading } from "./UnclaimedMapLoadingContext";
export type UnMatchedOffers =
  RouterOutputs["offers"]["getAllUnmatchedOffers"][number];

export default function UnclaimedOfferCards({
  setFunctionRef,
  mapBoundaries,
}: {
  setFunctionRef: (ref: any) => void;
  mapBoundaries: MapBoundary | null;
}) {
  const { adjustedProperties, setAdjustedProperties } = useAdjustedProperties();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const { data: session } = useSession();
  const { isLoading } = useLoading();
  const [isDelayedLoading, setIsDelayedLoading] = useState(true);
  const [showNoProperties, setShowNoProperties] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setIsDelayedLoading(true);
      setShowNoProperties(false);
      timer = setTimeout(() => {
        setIsDelayedLoading(false);
      }, 1000); // 1 second delay
    } else {
      timer = setTimeout(() => {
        setIsDelayedLoading(false);
      }, 1000); // Ensure minimum 1 second of skeleton even if loading finishes quickly
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  useEffect(() => {
    if (
      !isDelayedLoading &&
      (!adjustedProperties ||
        adjustedProperties.pages.length === 0 ||
        adjustedProperties?.pages[0]?.data.length === 0)
    ) {
      setShowNoProperties(true);
    } else {
      setShowNoProperties(false);
    }
  }, [isDelayedLoading, adjustedProperties]);

  const allProperties = useMemo(() => {
    return adjustedProperties?.pages.flatMap((page) => page.data) || [];
  }, [adjustedProperties]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allProperties.slice(startIndex, endIndex);
  }, [allProperties, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(allProperties.length / itemsPerPage);
  }, [allProperties, itemsPerPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      router.push(`?page=${page}`, undefined, { shallow: true });
    },
    [router],
  );

  useEffect(() => {
    console.log('total pages woohoo', totalPages);
    const page = Number(router.query.page) || 1;
    setCurrentPage(page);
  }, [router.query.page]);

  const renderPaginationItems = useCallback(() => {
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
      // Add logic for when there are more pages than maxVisiblePages
    }

    return items;
  }, [totalPages, currentPage, handlePageChange]);


  return (
    <div className="h-full w-full flex-col">
      <div className="flex h-screen-minus-header-n-footer w-full sm:h-screen-minus-header-n-footer-n-searchbar">
        <div className="mr-auto h-full w-full overflow-y-scroll px-6 scrollbar-hide">
          {isDelayedLoading ? (
            <div className="grid w-full grid-cols-1 gap-x-6 sm:grid-cols-2 md:grid-cols-3 md:gap-y-6 lg:gap-y-8 xl:gap-y-4 2xl:gap-y-0">
              {Array(24).fill(null).map((_, index) => (
                <div key={`skeleton-${index}`}>
                  <PropertyCardSkeleton />
                </div>
              ))}
            </div>
          ) : showNoProperties ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">No properties found</div>
                <div className="text-sm text-zinc-500 mt-2">
                  Try adjusting your search filters or zooming out on the map
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="grid w-full grid-cols-1 gap-x-6 sm:grid-cols-2 md:grid-cols-3 md:gap-y-6 lg:gap-y-8 xl:gap-y-4 2xl:gap-y-0">
                {paginatedProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <UnMatchedPropertyCard property={property} />
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination className="mb-4 mt-8">
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
                        handlePageChange(Math.min(totalPages, currentPage + 1));
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
            </div>
          )}
          {!isLoading && !isDelayedLoading && session?.user.role === "admin" && (
            <div className="mt-20 rounded-xl border-4 p-4">
              <AddUnclaimedOffer />
            </div>
          )}
        </div>
      </div>
    </div>
  );


}

export function UnMatchedPropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < property.imageUrls.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <Link href={`/public-offer/${property.id}`} className="block">
      <div
        className="relative flex aspect-[3/4] w-full cursor-pointer flex-col overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-[58%] overflow-hidden">
          <div
            className="flex h-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {property.imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative h-full w-full flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={`Property image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-xl object-cover"
                />
              </div>
            ))}
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            {currentImageIndex > 0 && (
              <Button
                onClick={prevImage}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-2 transition-all duration-200 hover:bg-white hover:bg-opacity-80"
              >
                <ChevronLeft size={24} className="text-gray-800" />
              </Button>
            )}
            {currentImageIndex < property.imageUrls.length - 1 && (
              <Button
                onClick={nextImage}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-2 transition-all duration-200 hover:bg-white hover:bg-opacity-80"
              >
                <ChevronRight size={24} className="text-gray-800" />
              </Button>
            )}
          </div>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 space-x-1">
            {property.imageUrls.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "w-2 bg-white"
                    : "w-1.5 bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="flex h-[42%] flex-col space-y-2 p-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 overflow-hidden overflow-ellipsis font-bold">
                  {property.name}
                </div>
              </div>
              <div className="ml-2 flex items-center space-x-1 whitespace-nowrap">
                <Star fill="gold" size={12} />
                <div>{property.avgRating?.toFixed(2) ?? "New"}</div>
                <div>
                  {property.numRatings > 0 ? `(${property.numRatings})` : ""}
                </div>
              </div>
            </div>
            <div className="text-sm text-zinc-500">
              {/* {formatDateRange(offer.checkIn, offer.checkOut)} */} 'replace
              with check in check out'
            </div>
            <div className="text-sm text-zinc-500">
              {plural(property.maxNumGuests, "Guest")}
            </div>
          </div>
          <div className="flex items-center space-x-3 text-sm font-semibold">
            <div>
              {formatCurrency(property.originalNightlyPrice)}
              &nbsp;night
            </div>
            <div className="text-xs text-zinc-500 line-through">
              airbnb&nbsp;
              {formatCurrency(
                property.originalNightlyPrice * AVG_AIRBNB_MARKUP,
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="relative flex aspect-[3/4] w-full flex-col overflow-hidden rounded-xl">
      <div className="relative h-[58%] overflow-hidden rounded-xl">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex h-[42%] flex-col space-y-2 p-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="ml-2 flex items-center space-x-1 whitespace-nowrap">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="mt-auto flex items-center space-x-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
}
