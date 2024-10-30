"use client";

import React from "react";
import AttentionCard from "./AttentionCard";
import { ZapIcon } from "lucide-react";
import { NotificationCard, NotificationCardSkeleton } from "./NotificationCard";
import { api } from "@/utils/api";

export default function AttentionOverviewSection() {
  const { data: allNotifications, isLoading } =
    api.host.getAllOverviewNotifications.useQuery();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Notification Card */}
      {!isLoading ? (
        allNotifications?.length && allNotifications.length > 0 ? (
          <NotificationCard
            title={`Sync Calendar for \n ${allNotifications[0]!.name}`}
            href={`/host/properties/${allNotifications[0]!.id}`}
            className="col-span-1"
            length={allNotifications.length + 1}
          />
        ) : null
      ) : (
        <NotificationCardSkeleton className="col-span-full lg:col-span-4" />
      )}

      {/* Attention Cards */}
      <AttentionCard
        icon={ZapIcon}
        title="Edit Auto Pricing"
        description="Optimize pricing for higher booking chances."
        subtitle="Customize prices based on demand and season."
        href="/host/properties"
        className="col-span-1 row-start-2 w-full"
      />
      <AttentionCard
        icon={ZapIcon}
        title="Turn Instant Booking On/Off"
        description="Control instant booking options for guests."
        subtitle="Allow guests to book automatically or require approval."
        href="/host/properties"
        className="col-span-1 row-start-2 w-full"
      />
    </div>
  );
}
