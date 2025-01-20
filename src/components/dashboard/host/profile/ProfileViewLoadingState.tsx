import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ProfileViewLoadingState() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Profile Card Skeleton */}
        <Card className="w-full md:w-[360px]">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex gap-6">
                <div>
                  <Skeleton className="mb-1 h-6 w-4" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <div>
                  <Skeleton className="mb-1 h-6 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Skeleton */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>

          {/* Verified Information Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
              <Skeleton className="h-4 w-48" />
            </CardContent>
          </Card>

          {/* Listings Section Skeleton */}
          <div>
            <Skeleton className="mb-4 h-7 w-48" />
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
