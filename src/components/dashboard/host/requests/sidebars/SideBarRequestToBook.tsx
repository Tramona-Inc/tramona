import React, { useState } from "react";
import { api } from "@/utils/api";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import EmptyRequestState from "./EmptyRequestState";
import Link from "next/link";
import { useRouter } from "next/router";

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

  const content = properties?.map((property) => {
    const unResolvedRequests = property.requestsToBook.filter(
      (request) => request.resolvedAt === null,
    );
    return (
      property.requestsToBook.length > 0 && (
        <div
          key={property.id}
          onClick={() => handlePropertyClick(property.id)}
          className={`${selectedPropertyId === property.id ? "bg-primaryGreen text-white" : ""} pointer flex flex-row justify-between gap-x-3 rounded-xl border p-3 py-5`}
        >
          <div className="text-wrap cursor-pointer">{property.name}</div>
          <p className="text-nowrap flex flex-row text-xs">
            {unResolvedRequests.length} Requests
          </p>
        </div>
      )
    );
  });

  return (
    <div>
      {!isLoading ? (
        properties && properties.length > 0 ? (
          <div className="flex flex-col gap-y-2">{content}</div>
        ) : (
          <EmptyRequestState />
        )
      ) : (
        <SidebarPropertySkeleton />
      )}
    </div>
  );
}

export default SidebarRequestToBook;
