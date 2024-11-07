import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type RouterOutputs } from "@/utils/api";
import { formatCurrency, plural } from "@/utils/utils";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
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

type Property = RouterOutputs["properties"]["getAllInfiniteScroll"]["data"][number];

export default function UnclaimedOfferCards({ mapBoundaries }: { mapBoundaries: MapBoundary | null; }): JSX.Element {
  const { adjustedProperties } = useAdjustedProperties();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const { data: session } = useSession();
  const { isLoading } = useLoading();
  const [isDelayedLoading, setIsDelayedLoading] = useState(true);
  const [showNoProperties, setShowNoProperties] = useState(false);
  const [isClient, setIsClient] = useState(false); // 确保仅客户端渲染

  useEffect(() => {
    setIsClient(true); // 仅在客户端执行
  }, []);

  useEffect(() => {
    if (!isDelayedLoading && (!adjustedProperties?.pages.length)) {
      setShowNoProperties(true);
    } else {
      setShowNoProperties(false);
    }
  }, [isDelayedLoading, adjustedProperties]);

  const allProperties = useMemo(() => adjustedProperties?.pages, [adjustedProperties]);

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allProperties?.slice(startIndex, endIndex);
  }, [allProperties, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(allProperties?.length / itemsPerPage)), [allProperties?.length, itemsPerPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    void router.push(`?page=${page}`, undefined, { shallow: true });
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setIsDelayedLoading(true);
      setShowNoProperties(false);
      timer = setTimeout(() => setIsDelayedLoading(false), 1000);
    } else {
      timer = setTimeout(() => setIsDelayedLoading(false), 1000);
    }
    return () => clearTimeout(timer);
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
          </PaginationItem>
      );
    }
    return items;
  }, [totalPages, currentPage, handlePageChange]);

  if (!isClient) {
    // 阻止服务器渲染的输出，确保仅在客户端渲染
    return null;
  }

  return (
      <div className="min-h-screen w-full flex flex-col items-center overflow-hidden bg-gray-50">
        <div className="flex h-full w-full max-w-screen-md mx-auto p-4 sm:p-6 md:px-8 lg:px-12">
          <div className="w-full overflow-y-auto">
            {isDelayedLoading ? (
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4">
                  {Array(24).fill(null).map((_, index) => (
                      <div key={`skeleton-${index}`} className="w-full">
                        <PropertyCardSkeleton />
                      </div>
                  ))}
                </div>
            ) : showNoProperties ? (
                <div className="flex h-full w-full items-center justify-center text-gray-600 text-center">
                  <div>
                    <div className="font-semibold text-lg">No properties found</div>
                    <p className="mt-2 text-sm">Try adjusting your filters or zooming out.</p>
                  </div>
                </div>
            ) : (
                <div className="flex h-full w-full flex-col">
                  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {paginatedProperties?.length &&
                        paginatedProperties.map((property, index) => (
                            <div key={property.originalListingId} className="animate-fade-in w-full" style={{ animationDelay: `${index * 50}ms` }}>
                              <UnMatchedPropertyCard property={property} />
                            </div>
                        ))}
                  </div>
                  {totalPages >= 1 && (
                      <div className="mt-4 flex justify-center px-2 py-3">
                        <Pagination className="flex flex-wrap gap-2 text-sm">
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                  href={`?page=${Math.max(1, currentPage - 1)}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(Math.max(1, currentPage - 1));
                                  }}
                                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                  )}
                </div>
            )}
            {!isLoading && !isDelayedLoading && session?.user.role === "admin" && (
                <div className="mt-12 rounded-xl border-4 p-4">
                  <AddUnclaimedOffer />
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

function UnMatchedPropertyCard({ property }: { property: Property }): JSX.Element {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
  const discountPercentage = calculateDiscountPercentage(property.originalNightlyPrice, property.nightlyPrice);

  const link = isAirbnb ? `https://airbnb.com/rooms/${property.originalListingId}` : `/property/${property.id}`;

  return (
      <Link href={link} className="block w-full">
        <div className="relative flex aspect-[4/3] w-full cursor-pointer flex-col overflow-hidden rounded-xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="relative h-full overflow-hidden">
            <div className="flex h-full transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
              {property.imageUrls.map((imageUrl, index) => (
                  <div key={index} className="relative h-full w-full flex-shrink-0">
                    <Image src={imageUrl} alt={`Property image ${index + 1}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="rounded-xl object-cover" />
                  </div>
              ))}
            </div>
            <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
              {currentImageIndex > 0 && (
                  <Button onClick={prevImage} className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-2 transition-all duration-200 hover:bg-white hover:bg-opacity-80">
                    <ChevronLeft size={24} className="text-gray-800" />
                  </Button>
              )}
              {currentImageIndex < property.imageUrls.length - 1 && (
                  <Button onClick={nextImage} className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white bg-opacity-50 p-2 transition-all duration-200 hover:bg-white hover:bg-opacity-80">
                    <ChevronRight size={24} className="text-gray-800" />
                  </Button>
              )}
            </div>
            {isAirbnb && (
                <div className="absolute left-3 top-3 h-8 bg-rose-500 text-white font-semibold p-1">
                  {discountPercentage}% off Airbnb
                </div>
            )}
            {!isAirbnb && (
                <div className="absolute left-3 top-3 h-8 bg-blue-500 text-white font-semibold p-1">
                  View Property
                </div>
            )}
          </div>
        </div>
        <div className="flex flex-col pt-2 px-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="min-w-0 flex-1">
              <div className="line-clamp-1 overflow-hidden font-semibold text-sm">
                {property.name}
              </div>
            </div>
            <div className="ml-2 flex items-center space-x-1">
              <Star fill="black" size={12} />
              <div>{property.avgRating ? property.avgRating.toFixed(2) : "New"}</div>
              <div>{property.numRatings > 0 ? `(${property.numRatings})` : ""}</div>
            </div>
          </div>
          <div className="text-muted-foreground text-xs sm:text-sm">
            <p>{plural(property.numBedrooms, "bed")}</p>
          </div>
          <div className="underline text-xs sm:text-sm">
            <p>
            <span className="font-semibold">
              {property.originalNightlyPrice ? formatCurrency(property.originalNightlyPrice) : "N/A"}
            </span>
              &nbsp;night
            </p>
          </div>
        </div>
      </Link>
  );
}

function calculateDiscountPercentage(originalPrice, nightlyPrice) {
  if (originalPrice && nightlyPrice) {
    return ((1 - nightlyPrice / originalPrice) * 100).toFixed(2);
  }
  return null;
}

function PropertyCardSkeleton(): JSX.Element {
  return (
      <div className="relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-xl">
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
