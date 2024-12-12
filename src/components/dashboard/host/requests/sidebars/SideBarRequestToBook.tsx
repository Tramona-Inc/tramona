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
  initialSelectedPropertyId
}: SidebarRequestToBookProps) {
  const router = useRouter();
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    initialSelectedPropertyId ?? null
  );

  useEffect(() => {
    setSelectedPropertyId(initialSelectedPropertyId ?? null);
  }, [initialSelectedPropertyId]);

  const handlePropertyClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    void router.push(
      {
        pathname: "/host/requests",
        query: { 
          ...router.query,
          tabs: "property-bids",
          propertyId: propertyId.toString()
        } as Record<string, string>,
      },
      undefined,
      { shallow: true }
    );
  };

  if (isLoading) {
    return <SidebarPropertySkeleton />;
  }

  if (!properties || properties.length === 0) {
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
            } pointer flex items-center gap-x-3 rounded-xl border p-3 py-5 cursor-pointer`}
          >
            <div className="flex-1 text-wrap min-w-0">
              {property.name}
            </div>
            <div className={`flex-shrink-0 whitespace-nowrap text-xs ${
              selectedPropertyId === property.id 
                ? "text-white" 
                : "text-muted-foreground"
            }`}>
              {plural(requestCount, "Bid", "Bids")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SidebarRequestToBook;