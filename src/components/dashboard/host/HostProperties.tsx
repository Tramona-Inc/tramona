import Spinner from "@/components/_common/Spinner";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { type Property } from "@/server/db/schema/tables/properties";
import { AlertCircle, FenceIcon } from "lucide-react";
import Image from "next/image";

export default function HostProperties({
  properties,
  searched = false,
  onSelectedProperty,
}: {
  properties: Property[] | null;
  searched?: boolean;
  onSelectedProperty: (property: Property) => void;
}) {
  const handleCardClick = (property: Property) => {
    onSelectedProperty(property);
  };

  return (
    <div>
      <div className="mx-auto my-4 max-w-8xl space-y-4">
        {properties ? (
          properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  handleCardClick={handleCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="pt-10">
              <EmptyState icon={FenceIcon}>
                <EmptyStateTitle>
                  {searched ? "No properties found" : "No properties yet"}
                </EmptyStateTitle>
                <EmptyStateDescription>
                  {searched
                    ? "Try a different property name or location"
                    : "Add a property to get started!"}
                </EmptyStateDescription>
              </EmptyState>
            </div>
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}

function PropertyCard({
  property,
  handleCardClick,
}: {
  property: Property;
  handleCardClick: (property: Property) => void;
}) {
  return (
    <a onClick={() => handleCardClick(property)} className="cursor-pointer">
      <div className="relative flex flex-col items-center gap-2 overflow-clip rounded-lg border-zinc-100 bg-card px-2 py-3 hover:bg-zinc-100">
        <div className="relative h-40 w-full">
          <Image
            src={property.imageUrls[0]!}
            fill
            className="rounded-xl object-cover object-center"
            alt=""
          />
        </div>
        <div className="flex-1">
          <p className="font-bold text-primary">
            {property.name === "" ? "No property name provided" : property.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {property.address === ", ,   , "
              ? "No address provided"
              : property.address}
          </p>
        </div>
        {!property.cancellationPolicy && (
          <AlertCircle
            className="absolute right-1 top-1 text-red-600"
            size={16}
          />
        )}
      </div>
    </a>
  );
}
