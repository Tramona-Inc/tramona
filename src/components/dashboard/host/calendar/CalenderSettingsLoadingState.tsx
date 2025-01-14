import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function CalenderSettingsLoadingState() {
  return (
    <div className="mx-auto w-full space-y-4 rounded-xl border px-12 py-6 sm:space-y-6 sm:px-0 md:w-3/4 lg:w-2/5">
      {/* Header */}
      <Skeleton className="mx-10 h-6 w-24 px-12 sm:h-8 sm:w-32" />

      {/* Tabs */}
      <div className="mx-10 flex gap-4 border-b pb-2 sm:gap-8">
        <Skeleton className="h-8 w-20 sm:h-10 sm:w-24" />
        <Skeleton className="h-8 w-20 sm:h-10 sm:w-24" />
      </div>

      {/* Book it now section */}
      <Card className="mx-10 space-y-4 p-4 sm:space-y-6 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-24 sm:h-6 sm:w-32" />
            <Skeleton className="h-3 w-full max-w-[18rem] sm:h-4" />
          </div>
        </div>

        {/* Slider section */}
        <div className="space-y-3 border-t py-4 sm:space-y-4 sm:py-6">
          <Skeleton className="h-5 w-20 sm:h-6 sm:w-24" />
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-full max-w-[15rem] sm:h-4" />
        </div>

        {/* Save button */}
        <div className="justify-endmx-10 flex">
          <Skeleton className="h-9 w-20 sm:h-10 sm:w-24" />
        </div>
      </Card>

      {/* Collapsible sections */}
      <Card className="mx-10 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 sm:h-6 sm:w-32" />
          <Skeleton className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </Card>

      <Card className="mx-10 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48 sm:h-6 sm:w-64" />
          <Skeleton className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </Card>
    </div>
  );
}

export default CalenderSettingsLoadingState;
