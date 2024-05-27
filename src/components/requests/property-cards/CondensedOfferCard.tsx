import { type Property } from "@/server/db/schema";
import Image from "next/image";
import Link from "next/link";

export default function CondensedOfferCard({
  property,
}: {
  property: Pick<Property, "id" | "imageUrls" | "name">;
}) {
  return (
    <div className="w-40 space-y-2">
      <Link
        href={`/property/${property.id}`}
        className="relative block h-40 w-full overflow-clip rounded-md"
      >
        <Image
          src={property.imageUrls[0]!}
          alt=""
          fill
          className="object-cover"
        />
      </Link>
      <p className="truncate text-xs font-semibold">{property.name}</p>
    </div>
  );
}
