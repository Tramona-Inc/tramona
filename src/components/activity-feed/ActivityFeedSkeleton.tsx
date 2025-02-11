import { Skeleton, SkeletonText } from "../ui/skeleton";

export default function ActivityFeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 50 }).map((_, index) => (
        <div className="mx-auto max-w-lg space-y-2" key={index}>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="grow space-y-2">
              <Skeleton className="h-4 w-1/4 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
            </div>
          </div>
          <SkeletonText className="text-base" />
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}
