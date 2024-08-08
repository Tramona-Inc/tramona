import Spinner from "@/components/_common/Spinner";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateFooter,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { type Property } from "@/server/db/schema/tables/properties";
import { AlertCircle, FenceIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { NewPropertyBtn } from "./HostPropertiesLayout";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";

export default function HostProperties({
  properties,
}: {
  properties: Property[] | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mx-auto max-w-7xl space-y-4">
        {properties ? (
          properties.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-1">
              {properties.map((property) => (
                <>
                  <PropertyCard key={property.id} property={property} />
                  <Separator />
                </>
              ))}
            </div>
          ) : (
            <EmptyState icon={FenceIcon}>
              <EmptyStateTitle>No properties yet</EmptyStateTitle>
              <EmptyStateDescription>
                Add a property to get started!
              </EmptyStateDescription>
              <EmptyStateFooter>
                <NewPropertyBtn open={open} setOpen={setOpen} />
              </EmptyStateFooter>
            </EmptyState>
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const router = useRouter();

  return (
    <a
      onClick={() => router.push(`/host/properties/${property.id}`)}
      className="cursor-pointer"
    >
      <div className="relative flex items-center gap-2 overflow-clip rounded-lg border-zinc-100 bg-card px-2 py-3 hover:bg-zinc-100">
        <div className="relative h-20 w-20">
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
          {/* <p className="text-sm text-muted-foreground">
            {[property.roomType, plural(property.maxNumGuests, "guest")]
              .filter(Boolean)
              .join(" · ")}
          </p> */}
        </div>
        {!property.cancellationPolicy && (
          <AlertCircle className="absolute top-1 right-1 text-red-600" size={16} />
        )}
        {/* <div className="p-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="rounded-full">
              <DotsVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem>
              <EditIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem red>
              <EyeOffIcon />
              Unlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
      </div>
    </a>
  );
}
