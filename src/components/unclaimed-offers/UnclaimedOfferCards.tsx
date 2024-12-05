import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatCurrency, formatDateMonthDayYear, plural } from "@/utils/utils";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAdjustedProperties } from "../landing-page/search/AdjustedPropertiesContext";
import AddUnclaimedOffer from "./AddUnclaimedOffer";
import { MapBoundary } from "../landing-page/search/SearchPropertiesMap";
import { useLoading } from "./UnclaimedMapLoadingContext";
import { Badge } from "../ui/badge";

type Property =
  RouterOutputs["properties"]["getAllInfiniteScroll"]["data"][number];

export default function UnclaimedOfferCards({
  mapBoundaries,
}: {
  mapBoundaries: MapBoundary | null;
}): JSX.Element {
  const { adjustedProperties } = useAdjustedProperties();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const { data: session } = useSession();
  const { isLoading } = useLoading();
  const [isDelayedLoading, setIsDelayedLoading] = useState(true);
  const [showNoProperties, setShowNoProperties] = useState(false);

  useEffect(() => {
    if (!isDelayedLoading && !adjustedProperties?.pages.length) {
      setShowNoProperties(true);
    } else {
      setShowNoProperties(false);
    }
  }, [isDelayedLoading, adjustedProperties]);

  // const allProperties = useMemo(() => {
  //   return adjustedProperties?.pages.flatMap((page) => page.data) ?? [];
  // }, [adjustedProperties]);

  const allProperties = useMemo(() => {
    return adjustedProperties?.pages;
    // .flatMap((page) => page?.data || []) // Use optional chaining and fallback
    // .filter(Boolean); // Filter out undefined values, if any
  }, [adjustedProperties]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allProperties?.slice(startIndex, endIndex);
  }, [allProperties, currentPage, itemsPerPage]);

  // console.log("paginatedProps:", paginatedProperties);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(allProperties?.length ?? 0 / itemsPerPage));
  }, [allProperties?.length, itemsPerPage]);

  // const url = new URL(router.pathname);

  const handlePageChange = useCallback(
    (page: number) => {
      // router.pathname.searchParams.set("page", page);
      setCurrentPage(page);
      void router.push(
        { pathname: router.pathname, query: { ...router.query, page } },
        undefined,
        { shallow: true },
      );
    },
    [router],
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setIsDelayedLoading(true);
      setShowNoProperties(false);
      timer = setTimeout(() => {
        setIsDelayedLoading(false);
      }, 1000);
    } else {
      timer = setTimeout(() => {
        setIsDelayedLoading(false);
      }, 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isLoading]);

  useEffect(() => {
    handlePageChange(1);
  }, [mapBoundaries]);

  useEffect(() => {
    const page = Number(router.query.page) || 1;
    setCurrentPage(page);
  }, [router.query.page]);

  const renderPaginationItems = useCallback(() => {
    const items = [];

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

    return items;
  }, [totalPages, currentPage, handlePageChange]);

  return (
    <div className="h-full w-full flex-col">
      <div className="flex h-screen-minus-header-n-footer w-full sm:h-screen-minus-header-n-footer-n-searchbar">
        <div className="mr-auto h-full w-full overflow-y-scroll px-4 scrollbar-hide lg:px-2">
          {isDelayedLoading ? (
            <div className="grid w-full grid-cols-1 gap-x-6 sm:grid-cols-2 md:gap-y-6 lg:grid-cols-3 lg:gap-y-8 xl:gap-y-4 2xl:gap-y-0">
              {Array(24)
                .fill(null)
                .map((_, index) => (
                  <div key={`skeleton-${index}`}>
                    <PropertyCardSkeleton />
                  </div>
                ))}
            </div>
          ) : showNoProperties ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">No properties found</div>
                <div className="mt-2 text-sm text-zinc-500">
                  Try adjusting your search filters or zooming out on the map
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col">
              {/* <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> */}
              <div className="grid grid-cols-1 gap-4 min-[580px]:grid-cols-2 min-[950px]:grid-cols-3 min-[1150px]:grid-cols-4">
                {paginatedProperties?.length &&
                  paginatedProperties.map((properties, index) => (
                    <div
                      key={index}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {properties &&
                        properties.data.map((property) => (
                          <UnMatchedPropertyCard
                            property={property}
                            key={property.id}
                          />
                        ))}
                    </div>
                  ))}
              </div>
              {totalPages >= 1 && (
                <div className="mt-auto px-6 py-4">
                  <Pagination>
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
                </div>
              )}
            </div>
          )}
          {!isLoading &&
            !isDelayedLoading &&
            session?.user.role === "admin" && (
              <div className="mt-20 rounded-xl border-4 p-4">
                <AddUnclaimedOffer />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function UnMatchedPropertyCard({
  property,
}: {
  property: Property;
}): JSX.Element {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const nextImage = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < property.imageUrls.length - 1) {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevImage = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prevIndex) => prevIndex - 1);
    }
  };

  const isAirbnb = property.originalListingPlatform === "Airbnb";
  const checkIn = formatDateMonthDayYear(
    new Date(router.query.checkIn as string),
  );
  const checkOut = formatDateMonthDayYear(
    new Date(router.query.checkOut as string),
  );
  const numGuests = 3;
  const link = isAirbnb
    ? `https://airbnb.com/rooms/${property.originalListingId}`
    : `/request-to-book/${property.id}?checkIn=${checkIn}&checkOut=${checkOut}&numGuests=${numGuests}`;

  return (
    <Link
      href={link}
      className="block"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className="relative flex aspect-square w-full cursor-pointer flex-col overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-full overflow-hidden">
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
          {isAirbnb &
          (
            <div className="absolute inset-0">
              <div className="flex justify-between">
                <Badge className="absolute left-3 top-3 h-8 bg-rose-500 font-semibold text-white">
                  Book on Airbnb
                </Badge>
              </div>
            </div>
          )}
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
      </div>
      <div className="flex flex-col pt-2">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="line-clamp-1 overflow-hidden overflow-ellipsis font-semibold">
              {property.name}
            </div>
          </div>
          <div className="ml-2 flex items-center space-x-1 whitespace-nowrap">
            <Star fill="black" size={12} />
            <div>
              {property.avgRating ? property.avgRating.toFixed(2) : "New"}
            </div>
            <div>
              {property.numRatings > 0 ? `(${property.numRatings})` : ""}
            </div>
          </div>
        </div>
        {/* <div className="text-sm text-zinc-500"> */}
        {/* {formatDateRange(offer.checkIn, offer.checkOut)} */}
        {/* replace with check in check out'
            </div> */}
        <div className="text-sm text-zinc-500">
          {plural(property.maxNumGuests, "Guest")}
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-3 text-sm font-semibold">
          <div>
            {property.originalNightlyPrice
              ? formatCurrency(property.originalNightlyPrice)
              : "N/A"}
            &nbsp;night
          </div>
          <div className="text-xs text-zinc-500 line-through">
            airbnb&nbsp;
            {property.originalNightlyPrice
              ? formatCurrency(
                  property.originalNightlyPrice * AVG_AIRBNB_MARKUP,
                )
              : "N/A"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function PropertyCardSkeleton(): JSX.Element {
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
