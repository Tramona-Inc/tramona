import React from "react";
import AttentionCard from "./AttentionCard";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { NotificationCard, NotificationCardSkeleton } from "./NotificationCard";
import { api } from "@/utils/api";

function AttentionOverviewSection() {
  const { data: allNotifications, isLoading } =
    api.host.getAllOverviewNotifications.useQuery();

  return (
    <div className="flex flex-col gap-4">
      {/* Notification Card */}
      <div className="flex w-full flex-col items-center md:flex-row md:items-start">
        {!isLoading ? (
          allNotifications?.length && allNotifications.length > 0 ? (
            <NotificationCard
              title={`Sync Calendar for \n ${allNotifications[0]!.name}`}
              href={`/host/properties/${allNotifications[0]!.id}`}
              className="w-80"
              length={allNotifications.length + 1}
            />
          ) : null
        ) : (
          <NotificationCardSkeleton className="w-full" />
        )}
      </div>

      {/* Attention Cards */}
      <div className="flex flex-col items-center gap-x-4 gap-y-4 md:flex-row md:items-start">
        <AttentionCard
          icon={LightningBoltIcon}
          title="Edit Auto Pricing"
          description="Optimize pricing for higher booking chances."
          subtitle="Customize prices based on demand and season."
          href="/host/properties"
          className="h-full w-80"
        />
        <AttentionCard
          icon={LightningBoltIcon}
          title="Turn Instant Booking On/Off"
          description="Control instant booking options for guests."
          subtitle="Allow guests to book automatically or require approval."
          href="/host/properties"
          className="h-full w-80"
        />
      </div>
    </div>
  );
}

export default AttentionOverviewSection;
