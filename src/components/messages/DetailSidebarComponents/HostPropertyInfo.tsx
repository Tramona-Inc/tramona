import React from "react";
import { Property } from "@/server/db/schema";
import ImageCarousel from "../../_common/ImageCarousel";

interface HostPropertyInfoProps {
  property: Property | undefined;
}

const HostPropertyInfo: React.FC<HostPropertyInfoProps> = ({ property }) => {
  return (
    <>
      {property && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <ImageCarousel imageUrls={property.imageUrls} />
        </div>
      )}
    </>
  );
};

export default HostPropertyInfo;
