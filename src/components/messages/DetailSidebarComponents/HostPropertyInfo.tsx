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
  return <PropertyOnlyImage property={property} />;
};

export default HostPropertyInfo;
