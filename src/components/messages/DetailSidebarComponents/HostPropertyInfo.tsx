import React from "react";
import { Property } from "@/server/db/schema";
import ImageCarousel from "../../_common/ImageCarousel";

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
        <div className="m-4 h-full rounded-lg bg-gray-50">
          <ImageCarousel imageUrls={property.imageUrls} />
        </div>
      )}
    </>
  );
};

export default HostPropertyInfo;
