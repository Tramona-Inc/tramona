import React, { useState } from "react";
import { api } from "@/utils/api";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import EmptyRequestState from "./EmptyRequestState";
import { useRouter } from "next/router";
import { plural } from "@/utils/utils";

function SidebarRequestToBook() {
  const router = useRouter();

  const { data: properties, isLoading } =
    api.requestsToBook.getAllRequestToBookProperties.useQuery();

  const [selectedPropertyId, setSelectedPropertyId] = useState<null | number>();

  const handlePropertyClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    void router.push(
      `/host/requests?tabs=request-to-book&propertyId=${propertyId}`,
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
            } ${
              requestCount === 0 
                ? "opacity-50 hover:opacity-75" 
                : ""
            } pointer flex items-center gap-x-3 rounded-xl border p-3 py-5`}
          >
            <div className="flex-1 text-wrap cursor-pointer min-w-0">
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