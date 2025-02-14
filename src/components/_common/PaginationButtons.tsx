import { NextRouter } from "next/router";
import { useMemo, useEffect, useCallback } from "react";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Pagination,
  PaginationPrevious,
  PaginationNext,
} from "../ui/pagination";

export default function PaginationButtons({
  items,
  setCurrentPage,
  currentPage,
  router,
  itemsPerPage,
}: {
  items: unknown[];
  setCurrentPage: (currentPage: number) => void;
  currentPage: number;
  router: NextRouter;
  itemsPerPage: number;
}) {
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / itemsPerPage));
  }, [items.length, itemsPerPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      void router.push(
        { pathname: router.pathname, query: { ...router.query, page } },
        undefined,
        { shallow: false },
      );
    },
    [router, setCurrentPage],
  );

  useEffect(() => {
    const page = Number(router.query.page) || 1;
    setCurrentPage(page);
  }, [router.query.page, setCurrentPage]);

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

  return (
    <div>
      {totalPages > 1 && (
        <Pagination className="mt-8">
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
  );
}
