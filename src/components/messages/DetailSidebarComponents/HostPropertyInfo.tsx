import React from "react";
import { Property } from "@/server/db/schema";
import PropertyOnlyImage from "./PropertyOnlyImage";
import Image from "next/image";
interface RequiredPropertyInfo {
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
  return (
    <>
      {property && (
        <div className="relative z-20 m-4 h-full rounded-lg bg-black">
          <PropertyOnlyImage images={property.imageUrls} />
        </div>
      )}
    </>
  );
};

export default HostPropertyInfo;
