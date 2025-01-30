import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { plural } from "@/utils/utils";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import EmptyRequestState from "./EmptyRequestState";
import type { Property } from "@/server/db/schema";

interface RequestToBook {
  resolvedAt: Date | null;
}

interface PropertyWithRequests extends Property {
  requestsToBook: RequestToBook[];
}

interface SidebarRequestToBookProps {
  properties: PropertyWithRequests[] | undefined;
  isLoading: boolean;
  initialSelectedPropertyId?: number;
}

function SidebarRequestToBook({
  properties,
  isLoading,
  initialSelectedPropertyId,
}: SidebarRequestToBookProps) {
  const router = useRouter();
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    initialSelectedPropertyId ?? null,
  );

  useEffect(() => {
    setSelectedPropertyId(initialSelectedPropertyId ?? null);
    if (initialSelectedPropertyId) {
      void router.push(
        {
          pathname: `/host/requests/requests-to-book/${initialSelectedPropertyId}`,
        },
        undefined,
        { shallow: true },
      );
    }
  }, [initialSelectedPropertyId]);

  const handlePropertyClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    void router.push(
      {
        pathname: `/host/requests/requests-to-book/${propertyId}`,
      },
      undefined,
      { shallow: true },
    );
  };

  if (!properties) {
    return <SidebarPropertySkeleton />;
  }

  if (properties.length === 0) {
    return <EmptyRequestState />;
  }

  return (
    <div className="flex flex-col gap-y-2">
      {properties.map((property) => {
        const unResolvedRequests = property.requestsToBook.filter(
          (request) => request.resolvedAt === null,
        );
        const requestCount = unResolvedRequests.length;

        return (
          <div
            key={property.id}
            onClick={() => handlePropertyClick(property.id)}
            className={`${
              selectedPropertyId === property.id
                ? "bg-primaryGreen text-white"
                : ""
            } pointer flex cursor-pointer items-center gap-x-3 rounded-xl border p-3 py-5`}
          >
            <div className="min-w-0 flex-1 text-wrap">{property.name}</div>
            <div
              className={`flex-shrink-0 whitespace-nowrap text-xs ${
                selectedPropertyId === property.id
                  ? "text-white"
                  : "text-muted-foreground"
              }`}
            >
              {plural(requestCount, "Bid", "Bids")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SidebarRequestToBook;
