import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import { formatCurrency, formatDateMonthDayYear, plural } from "@/utils/utils";
import { Star, ChevronLeft, ChevronRight, StarIcon } from "lucide-react";
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
import {
  AirbnbSearchResult,
  useAdjustedProperties,
} from "../landing-page/search/AdjustedPropertiesContext";
import AddUnclaimedOffer from "./AddUnclaimedOffer";
import { useLoading } from "./UnclaimedMapLoadingContext";
import { Badge } from "../ui/badge";
import { Property } from "@/server/db/schema/tables/properties";

export default function UnclaimedOfferCards(): JSX.Element {
  const { adjustedProperties } = useAdjustedProperties();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 36;
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

  const allProperties = useMemo(() => {
    return adjustedProperties?.pages;
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
      console.log("ran");
      setCurrentPage(page);
      void router.push(
        { pathname: router.pathname, query: { ...router.query, page } },
        undefined,
        { shallow: false },
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
    const page = Number(router.query.page) || 1;
    setCurrentPage(page);
  }, [router.query.page]);

  const renderPaginationItems = useCallback(() => {
    const items = [];
    const SIBLING_COUNT = 1;
    const BOUNDARY_COUNT = 1;

    const createPageItem = (pageNum: number) => (
      <PaginationItem key={pageNum}>
        <PaginationLink
          href={`?page=${pageNum}`}
          onClick={() => {
            handlePageChange(pageNum);
          }}
          isActive={currentPage === pageNum}
        >
          {pageNum}
        </PaginationLink>
      </PaginationItem>
    );

    for (let i = 1; i <= Math.min(BOUNDARY_COUNT, totalPages); i++) {
      items.push(createPageItem(i));
    }

    const startPage = Math.max(BOUNDARY_COUNT + 1, currentPage - SIBLING_COUNT);
    const endPage = Math.min(
      totalPages - BOUNDARY_COUNT,
      currentPage + SIBLING_COUNT,
    );

    if (startPage > BOUNDARY_COUNT + 1) {
      items.push(
        <PaginationItem key="start-ellipsis" className="px-2">
          ...
        </PaginationItem>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > BOUNDARY_COUNT && i < totalPages - BOUNDARY_COUNT + 1) {
        items.push(createPageItem(i));
      }
    }

    if (endPage < totalPages - BOUNDARY_COUNT) {
      items.push(
        <PaginationItem key="end-ellipsis" className="px-2">
          ...
        </PaginationItem>,
      );
    }

    for (
      let i = Math.max(totalPages - BOUNDARY_COUNT + 1, BOUNDARY_COUNT + 1);
      i <= totalPages;
      i++
    ) {
      if (i > endPage) {
        items.push(createPageItem(i));
      }
    }

    return items;
  }, [totalPages, currentPage, handlePageChange]);

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="mr-auto w-full overflow-y-auto">
          {isDelayedLoading ? (
            <div className="mx-auto max-w-[2000px] px-4">
              <div className="grid w-full grid-cols-1 gap-4 min-[580px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1000px]:grid-cols-4 min-[1200px]:grid-cols-5 min-[1400px]:grid-cols-6">
                {Array(24)
                  .fill(null)
                  .map((_, index) => (
                    <div key={`skeleton-${index}`}>
                      <PropertyCardSkeleton />
                    </div>
                  ))}
              </div>
            </div>
          ) : showNoProperties ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-bold">
                  Search for properties in the search bar above
                </div>
                <div className="mt-2 text-sm text-zinc-500">
                  Once you make a search, you will be able to see properties
                  here
                </div>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col">
              <div className="mx-auto max-w-[2000px] px-4">
                <div className="grid w-full grid-cols-1 gap-4 min-[580px]:grid-cols-2 min-[800px]:grid-cols-3 min-[1000px]:grid-cols-4 min-[1200px]:grid-cols-5 min-[1400px]:grid-cols-6">
                  {paginatedProperties?.length &&
                    paginatedProperties.map((property, index) => (
                      <div
                        key={index}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <UnMatchedPropertyCard property={property} />
                      </div>
                    ))}
                </div>

                {totalPages >= 1 && (
                  <div className="mt-8">
                    <Pagination>
                      <PaginationContent className="flex flex-wrap justify-center overflow-x-auto">
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
                        <div className="flex flex-wrap justify-center">
                          {renderPaginationItems()}
                        </div>
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
            </div>
          )}
          {!isLoading &&
            !isDelayedLoading &&
            session?.user.role === "admin" && (
              <div className="mx-auto mt-20 max-w-[2000px] px-4">
                <div className="rounded-xl border-4 p-4">
                  <AddUnclaimedOffer />
                </div>
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
  property: Property | AirbnbSearchResult;
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
  const checkIn = router.query.checkIn
    ? formatDateMonthDayYear(new Date(router.query.checkIn as string))
    : null;
  const checkOut = router.query.checkOut
    ? formatDateMonthDayYear(new Date(router.query.checkOut as string))
    : null;
  const numGuests = 3;
  const link = isAirbnb
    ? `https://airbnb.com/rooms/${property.originalListingId}`
    : (() => {
        if ("id" in property) {
          return `/request-to-book/${property.id}?checkIn=${checkIn}&checkOut=${checkOut}&numGuests=${numGuests}`;
        }
        throw new Error("Property ID is required for non-Airbnb properties");
      })();

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
          {isAirbnb && (
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
            <StarIcon className="inline size-[1em] fill-primaryGreen stroke-primaryGreen" />{" "}
            <div>
              {"avgRating" in property
                ? property.avgRating !== 0
                  ? property.avgRating.toFixed(2)
                  : "New"
                : "New"}
            </div>
            <div>
              {"numRatings" in property
                ? property.numRatings !== 0
                  ? `(${property.numRatings})`
                  : ""
                : ""}
            </div>
          </div>
        </div>
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
