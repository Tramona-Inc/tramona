import Image from "next/image";
import Link from "next/link";

type PropertyCard = {
  id: number;
  imageUrls: string[];
  name: string;
  maxNumGuests: number;
  numBathrooms: number | null;
  numBedrooms: number;
  numBeds: number;
  originalNightlyPrice: number | null;
  distance: unknown;
};

export default function CondensedOfferCard({
  property,
}: {
  property: PropertyCard;
}) {
  return (
    <div className="relative">
      <div className="space-y-2">
        <div>
          <Link href={`/property/${property.id}`}>
            <Image
              src={property.imageUrls[0]!}
              height={500}
              width={500}
              alt=""
              className="aspect-square w-full rounded-xl object-cover"
            />
          </Link>
        </div>
        <div className="flex flex-col">
          <p className="max-w-full overflow-hidden text-ellipsis text-nowrap text-xs font-semibold">
            {property.name}
          </p>
        </div>
      </div>
    </div>
  );
}
