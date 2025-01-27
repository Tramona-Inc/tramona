export default function RequestAndBidLoadingState() {
  return (
    <div className="relative flex w-full items-center justify-between rounded-xl border p-4 shadow-sm">
      <div className="flex flex-1 flex-col gap-4">
        {/* Status Badge Skeleton */}
        <div className="w-20">
          <div className="h-6 w-full animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* Location and Title Skeletons */}
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200" />
          <div className="h-6 w-64 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Price Skeleton */}
        <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />

        {/* Date and Guests Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 animate-pulse rounded-md bg-gray-200" />
          <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Right side image skeleton */}
      <div className="relative ml-4 h-[180px] w-[280px] overflow-hidden rounded-lg">
        <div className="h-full w-full animate-pulse bg-gray-200">
          {/* Property details overlay skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="h-5 w-48 animate-pulse rounded-md bg-gray-300/50" />
            <div className="mt-1 h-4 w-24 animate-pulse rounded-md bg-gray-300/50" />
          </div>
        </div>
      </div>

      {/* Menu dots skeleton */}
      <div className="absolute right-4 top-4">
        <div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
