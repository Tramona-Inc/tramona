import Spinner from "@/components/_common/Spinner";
import { Badge } from "@/components/ui/badge";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { type Property } from "@/server/db/schema/tables/properties";
import supabase from "@/utils/supabase-client";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";
import { FenceIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function HostProperties({
  properties,
  currentHostTeamId,
  searched = false,
  onSelectedProperty,
}: {
  properties: Property[] | null;
  searched?: boolean;
  currentHostTeamId: number | undefined | null;
  onSelectedProperty: (property: Property) => void;
}) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const handleCardClick = (property: Property) => {
    onSelectedProperty(property);
  };

  const ITEMS_PER_PAGE = 20;

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((properties?.length ?? 0) / ITEMS_PER_PAGE));
  }, [properties, ITEMS_PER_PAGE]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      void router.push(
        { pathname: router.pathname, query: { ...router.query, page } },
        undefined,
        { shallow: false },
      );
    },
    [router],
  );

  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return properties?.slice(startIndex, endIndex);
  }, [properties, currentPage, ITEMS_PER_PAGE]);

  useEffect(() => {
    const page = Number(router.query.page) || 1;
    setCurrentPage(page);
  }, [router.query.page]);

  const renderPaginationItems = useCallback(() => {
    const items: JSX.Element[] = [];
    const SIBLING_COUNT = 1;
    const BOUNDARY_COUNT = 1;

    if (totalPages === 0) {
      return items;
    }

    const createPageItem = (pageNum: number): JSX.Element => (
      <PaginationItem key={pageNum}>
        <PaginationLink
          href={`?page=${pageNum}`}
          onClick={(e) => {
            e.preventDefault();
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

  const memoizedPaginationItems = useMemo(() => {
    return renderPaginationItems();
  }, [renderPaginationItems]);

  // < -------------- LOGIC FOR SYNCING HOSPITABLE Properties loading state -------->
  const [showIsSyncingState, setShowIsSyncingState] = useState(false);

  useEffect(() => {
    const subscription = supabase
      .channel("properties-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "properties" },
        (payload) => {
          console.log(payload);
          console.log(
            "New property added within a minute for the current team:",
            payload.new.host_team_id,
          );
          if (payload.new.host_team_id === currentHostTeamId) {
            console.log(typeof payload.new.host_team_id);
            console.log("it matches");
            console.log(payload.new.created_at);
            setShowIsSyncingState(true);
          }
        },
      )
      .subscribe((status) => {
        console.log(status);
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          console.log("Listening for new properties...");
        } else {
          setShowIsSyncingState(false);
        }
      });

    return () => {
      void subscription.unsubscribe();
    };
  }, [currentHostTeamId]);

  return (
    <div>
      <div className="mx-auto my-4 w-full max-w-8xl space-y-4">
        {paginatedProperties ? (
          paginatedProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {paginatedProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  handleCardClick={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="pt-10">
              <EmptyState icon={FenceIcon}>
                <EmptyStateTitle>
                  {searched ? "No properties found" : "No properties yet"}
                </EmptyStateTitle>
                <EmptyStateDescription>
                  {searched
                    ? "Try a different property name or location"
                    : "Add a property to get started!"}
                </EmptyStateDescription>
              </EmptyState>
            </div>
          )
        ) : (
          <Spinner />
        )}
        {/* Loading state for properties being loaded in from hospitable */}
        {showIsSyncingState && (
          <div className="mx-auto w-full text-center text-gray-600">
            Syncing properties from Airbnb ...{" "}
          </div>
        )}
        {totalPages > 1 && (
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
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              <div className="flex flex-wrap justify-center">
                {memoizedPaginationItems}
              </div>
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
    </div>
  );
}

function PropertyCard({
  property,
  handleCardClick,
}: {
  property: Property;
  handleCardClick: (property: Property) => void;
}) {
  return (
    <a onClick={() => handleCardClick(property)} className="cursor-pointer">
      <div className="relative flex flex-col items-center gap-2 overflow-clip rounded-lg border-zinc-100 bg-card px-2 py-3 hover:bg-zinc-100">
        <div className="relative h-40 w-full">
          <Image
            src={property.imageUrls[0]!}
            fill
            className="rounded-xl object-cover object-center"
            alt=""
          />
        </div>
        <div className="flex-1">
          <p className="font-bold text-primary">
            {property.name === "" ? "No property name provided" : property.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {property.address === ", ,   , "
              ? "No address provided"
              : property.address}
          </p>
        </div>
        {!property.cancellationPolicy && (
          <Badge variant="red" className="absolute left-4 top-5 space-x-1">
            {" "}
            <div className="h-2 w-2 rounded-full bg-red-600" />
            <p>Needs Attention</p>
          </Badge>
        )}
      </div>
    </a>
  );
}
