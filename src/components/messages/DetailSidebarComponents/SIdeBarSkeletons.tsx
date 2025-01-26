import { Skeleton } from "@/components/ui/skeleton";

export function PropertySkeletons() {
  return (
    <div className="space-y-4">
      {/* Image carousel skeleton */}
      <div className="relative h-72 w-full overflow-hidden rounded-md">
        <Skeleton className="h-full w-full" />

        {/* Navigation button skeletons */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      {/* Dots skeleton */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {[1, 2, 3].map((_, i) => (
          <Skeleton key={i} className="h-2 w-2 rounded-full" />
        ))}
      </div>
      {/* Property info skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
