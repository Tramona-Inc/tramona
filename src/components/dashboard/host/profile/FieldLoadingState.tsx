import { Skeleton } from "@/components/ui/skeleton";

export function FieldLoadingState() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProfileLoadingSkeleton key={index} />
      ))}
    </div>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <div className="flex w-full items-start gap-3 rounded-lg p-4">
      <Skeleton className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
