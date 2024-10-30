import React from "react";
import AttentionCard from "./AttentionCard";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { NotificationCard, NotificationCardSkeleton } from "./NotificationCard";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

function AttentionOverviewSection() {
  const { data: allNotifications, isLoading } =
    api.host.getAllOverviewNotifications.useQuery();
  return (
    <div className="flex flex-col gap-y-4">
      {/* Notifications Cards */}
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {!isLoading
          ? allNotifications?.map(
              (
                notification,
                index, // when we want to add more notifications we can just create a new object
              ) => (
                <NotificationCard
                  title={`Sync Calendar for \n ${notification.name}`}
                  href={`/host/properties/${notification.id}`}
                  className="col-auto"
                  key={index}
                />
              ),
            )
          : Array.from({ length: 4 }).map((_, index) => (
              <NotificationCardSkeleton key={index} />
            ))}
      </div>
      {/* AttentionCards */}
      <div className="grid grid-cols-2 gap-x-3">
        <AttentionCard
          icon={LightningBoltIcon}
          // Content props
          title="Edit Auto Pricing"
          description="Optimize pricing for higher booking chances."
          subtitle="Customize prices based on demand and season."
          href="/host/properties"
          // Style props
          className=""
        />
        <AttentionCard
          icon={LightningBoltIcon}
          // Content props
          title="Turn Instant Booking On/Off"
          description="Control instant booking options for guests."
          subtitle="Allow guests to book automatically or require approval."
          href="/host/properties"
          // Style props
          className=""
        />
      </div>
    </div>
  );
}

export default AttentionOverviewSection;
