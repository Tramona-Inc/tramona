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
  if (
    !isLoading &&
    (!allNotifications ||
      (allNotifications.unSyncedProperties.length === 0 &&
        allNotifications.propertiesWithNoBookItNow.length === 0 &&
        allNotifications.propertiesWithNoMinPrice.length === 0))
  ) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-4 sm:px-0 lg:grid-cols-4">
      {/* Notification Cards */}
      {!isLoading ? (
        <>
          {allNotifications?.unSyncedProperties.map((property) => (
            <NotificationCard
              key={property.id}
              action="Sync Calendar for"
              title={property.name}
              href={`/host/calendar?propertyId=${property.id}`}
              className="col-span-1 sm:col-span-1"
              length={allNotifications.unSyncedProperties.length}
            />
          ))}
          {allNotifications?.propertiesWithNoBookItNow.map((property) => (
            <NotificationCard
              key={property.id}
              action="Enable Book-it-now for"
              title={property.name}
              href={`/host/calendar?propertyId=${property.id}`}
              className="col-span-1"
              length={allNotifications.propertiesWithNoBookItNow.length}
            />
          ))}
          {allNotifications?.propertiesWithNoMinPrice.map((property) => (
            <NotificationCard
              key={property.id}
              action="Set Minimum Price for"
              title={property.name}
              href={`/host/calendar?propertyId=${property.id}&tab=restrictions`}
              className="col-span-1"
              length={allNotifications.propertiesWithNoMinPrice.length}
            />
          ))}
        </>
      ) : (
        <>
          <NotificationCardSkeleton className="col-span-full sm:col-span-1" />
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
