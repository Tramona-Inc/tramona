"use client";

import React from "react";
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

  // Render null only after loading is complete
  if (!isLoading && (!allNotifications || allNotifications.length === 0)) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-4 sm:px-0 lg:grid-cols-4">
      {/* Notification Cards */}
      {!isLoading ? (
        <>
          <NotificationCard
            action="Sync Calendar for"
            title={allNotifications[0]!.name}
            href={`/host/calendar?propertyId=${allNotifications[0]!.id}`}
            className="col-span-1 sm:col-span-1"
            length={allNotifications.length}
          />
          <NotificationCard
            action="Enable Book-it-now for"
            title={allNotifications[0]!.name}
            href={`/host/calendar?propertyId=${allNotifications[0]!.id}`}
            className="col-span-1"
            length={allNotifications.length}
          />
        </>
      ) : (
        <>
          <NotificationCardSkeleton className="col-span-full sm:col-span-1" />
          <NotificationCardSkeleton className="col-span-full sm:col-span-1" />
        </>
      )}

      {/* Attention Cards */}
      {/* <AttentionCard
        icon={ZapIcon}
        title="Edit Auto Pricing"
        description="Optimize pricing for higher booking chances."
        subtitle="Customize prices based on demand and season."
        href={`/host/calendar`}
        className="col-span-full w-full sm:col-span-1 md:row-start-2"
      />
      <AttentionCard
        icon={ZapIcon}
        title="Turn Instant Booking On"
        description="Control instant booking options for guests."
        subtitle="Allow guests to book automatically or require approval."
        href="/host/calendar"
        className="col-span-full w-full sm:col-span-1 md:row-start-2"
      /> */}
    </div>
  );
}
