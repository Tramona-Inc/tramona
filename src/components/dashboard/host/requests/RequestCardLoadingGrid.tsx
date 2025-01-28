import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function RequestCardLoadingSkeleton() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* Header with avatar and name */}
      <div className="mb-4 flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Date and guests */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}

export function RequestCardLoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <RequestCardLoadingSkeleton key={index} />
      ))}
    </div>
  );
}
