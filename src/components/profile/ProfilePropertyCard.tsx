import { Property } from "@/server/db/schema";
import { formatDateMonthDayYear } from "@/utils/utils";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePropertyCard({
  property,
}: {
  property: Property;
}) {
  const date = new Date();
  const checkIn = formatDateMonthDayYear(
    new Date(date.setDate(date.getDate() + 1)),
  );
  const checkOut = formatDateMonthDayYear(
    new Date(date.setDate(date.getDate() + 3)),
  );

  const isAirbnb =
    "originalListingPlatform" in property &&
    property.originalListingPlatform === "Airbnb";
  const numGuests = 3;
  const link = isAirbnb
    ? `https://airbnb.com/rooms/${property.originalListingId}`
    : (() => {
        if ("id" in property) {
          return `/request-to-book/${property.id}?checkIn=${checkIn}&checkOut=${checkOut}&numGuests=${numGuests}`;
        }
        throw new Error("Property ID is required for non-Airbnb properties");
      })();

  return (
    <Link
      href={link}
      className="block"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="relative mb-2 aspect-square">
        <Image
          src={property.imageUrls[0]!}
          alt={property.name}
          fill
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="font-semibold">{property.propertyType}</p>
        <div className="flex items-center gap-1">
          <StarIcon className="inline size-[1em] fill-primaryGreen stroke-primaryGreen" />
          <p>{property.avgRating === 0 ? "New" : property.avgRating}</p>
        </div>
      </div>
      <p className="text-muted-foreground">{property.name}</p>
    </Link>
  );
}
