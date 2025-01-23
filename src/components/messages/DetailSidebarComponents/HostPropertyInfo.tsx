import React from "react";
import { Property } from "@/server/db/schema";
import PropertyOnlyImage from "./PropertyOnlyImage";
import Link from "next/link";
import { generateBookingUrl } from "@/utils/utils";

interface RequiredPropertyInfo {
  id: number;
  name: string;
  numBedrooms: number;
  numBathrooms: number | null;
  hostName: string | null;
  hostProfilePic: string | null;
  city: string;
  imageUrls: string[];
  bookOnAirbnb: boolean;
}

interface HostPropertyInfoProps {
  property: (Partial<Property> & RequiredPropertyInfo) | undefined;
}

const HostPropertyInfo: React.FC<HostPropertyInfoProps> = ({ property }) => {
  const url = property ? generateBookingUrl(property.id) : "";
  return (
    <>
      {property ? (
        <Link href={url}>
          <div className="relative z-20 m-4 h-full">
            <PropertyOnlyImage imageUrls={property.imageUrls} />
          </div>
        </Link>
      ) : (
        <ImagesLoadingState />
      )}
    </>
  );
};

export default HostPropertyInfo;

function ImagesLoadingState() {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-md bg-gray-200">
      <div className="h-full w-full animate-pulse">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
