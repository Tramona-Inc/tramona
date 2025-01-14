"use client";

import React from "react";
import AttentionCard from "./AttentionCard";
import { ZapIcon } from "lucide-react";
import { NotificationCard, NotificationCardSkeleton } from "./NotificationCard";
import { api } from "@/utils/api";

export default function AttentionOverviewSection({
  currentHostTeamId,
}: {
  currentHostTeamId: number | undefined | null;
}) {
  const { data: allNotifications, isLoading } =
    api.hosts.getAllOverviewNotifications.useQuery(
      { currentHostTeamId: currentHostTeamId! },
      { enabled: !!currentHostTeamId },
    );

  return (
    <div className="grid grid-cols-2 gap-4 px-4 sm:px-0 lg:grid-cols-4">
      {/* Notification Cards */}
      {!isLoading && currentHostTeamId ? (
        allNotifications?.length && allNotifications.length > 0 ? (
          <>
            <NotificationCard
              action="Sync Calendar for"
              title={allNotifications[0]!.name}
              href={`/host/calendar?propertyId=${allNotifications[0]!.id}`}
              className="col-span-1 sm:col-span-1"
              length={allNotifications.length + 1}
            />
            <NotificationCard
              action="Enable Auto Offers for"
              title={allNotifications[0]!.name}
              href={`/host/properties/${allNotifications[0]!.id}`}
              className="col-span-1"
              length={allNotifications.length + 1}
            />
          </>
        ) : null
      ) : (
        <>
          <NotificationCardSkeleton className="col-span-full sm:col-span-1" />
          <NotificationCardSkeleton className="col-span-full sm:col-span-1" />
        </>
      )}

      {/* Attention Cards */}
      <AttentionCard
        icon={ZapIcon}
        title="Edit Auto Pricing"
        description="Optimize pricing for higher booking chances."
        subtitle="Customize prices based on demand and season."
        href="/host/properties"
        className="col-span-full w-full sm:col-span-1 md:row-start-2"
      />
      <AttentionCard
        icon={ZapIcon}
        title="Turn Instant Booking On"
        description="Control instant booking options for guests."
        subtitle="Allow guests to book automatically or require approval."
        href="/host/properties"
        className="col-span-full w-full sm:col-span-1 md:row-start-2"
      />
    </div>
  );
}
