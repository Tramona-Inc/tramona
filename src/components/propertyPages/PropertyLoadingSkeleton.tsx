import { Skeleton } from "@/components/ui/skeleton";
import { Shield } from "lucide-react";

export default function PropertySkeleton({
  propertyOnly = false,
}: {
  propertyOnly?: boolean;
}) {
  return (
    <div className="mx-auto max-w-7xl space-y-3">
      {/* Image Gallery Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="relative">
          <Skeleton className="absolute inset-0 rounded-lg" />
        </div>
        <div className="hidden grid-cols-2 gap-4 md:grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative aspect-[4/3]">
              <Skeleton className="absolute inset-0 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
      <Skeleton className="h-[28rem] w-full rounded-lg md:hidden" />
      {/* Property Title and Details */}
      <div className="flex w-full flex-row space-y-5">
        <div className="w-full max-w-7xl space-y-8 p-2 md:p-4">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          {/* Host Section */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-32" />
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Booking Section */}
          <div className="space-y-4 rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>

            {/* Check-in/Check-out */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-full" />
            </div>

            {/* Book Button */}
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        {!propertyOnly && <BookingWidgetSkeleton />}
      </div>
    </div>
  );
}

function BookingWidgetSkeleton() {
  return (
    <div className="hidden w-full max-w-sm space-y-6 rounded-lg bg-white p-3 px-6 shadow-sm md:block">
      {/* Check-in/out Dates */}
      <div className="space-y-4 py-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" /> {/* CHECK-IN label */}
          <Skeleton className="h-8 w-32" /> {/* Date */}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" /> {/* CHECK-OUT label */}
          <Skeleton className="h-8 w-32" /> {/* Date */}
        </div>
      </div>

      {/* Guests */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" /> {/* GUESTS label */}
        <Skeleton className="h-8 w-28" /> {/* Guest count */}
      </div>

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-12 w-32" /> {/* Price */}
          <Skeleton className="h-6 w-24" /> {/* Per Night */}
        </div>
        <Skeleton className="h-5 w-64" /> {/* Savings message */}
      </div>

      {/* Price Breakdown Button */}
      <Skeleton className="h-10 w-full" />

      {/* Place Request Button */}
      <Skeleton className="h-12 w-full" />

      {/* Additional Info */}
      <div className="text-center">
        <Skeleton className="mx-auto h-5 w-48" />{" "}
        {/* Won't be charged message */}
      </div>

      {/* List Property Link */}
      <div className="text-center">
        <Skeleton className="mx-auto h-6 w-56" />
      </div>

      {/* Payment Protection */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-muted-foreground" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    </div>
  );
}
