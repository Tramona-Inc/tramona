import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import HostPropertyForm from "@/components/host/HostPropertyForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateFooter,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { type Property } from "@/server/db/schema/tables/properties";
import { api } from "@/utils/api";
import { plural } from "@/utils/utils";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { EditIcon, EyeOffIcon, FenceIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { NewPropertyBtn } from "./HostPropertiesLayout";
import { Separator } from "@/components/ui/separator";

export default function HostProperties({
  onSendData,
}: {
  onSendData: (property: Property) => void;
}) {
  const [open, setOpen] = useState(false);

  const { data: properties } = api.properties.getHostProperties.useQuery({
    limit: 20,
  });

  return (
    <div>
      <div className="mx-auto max-w-7xl space-y-4">
        {properties ? (
          properties.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-1">
              {properties.map((property) => (
                <>
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSendData={onSendData}
                  />
                  <Separator />
                </>
              ))}
            </div>
          ) : (
            <EmptyState icon={FenceIcon} className="h-[calc(100vh-240px)]">
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

function PropertyCard({
  property,
  onSendData,
}: {
  property: Property;
  onSendData: (property: Property) => void;
}) {
  const handleClick = () => {
    onSendData(property);
  };

  return (
    <a onClick={handleClick} className=" cursor-pointer">
      <div className="flex items-center gap-2 overflow-clip rounded-lg border-zinc-100 bg-card px-2 py-3 hover:bg-zinc-100">
        <div className="relative h-20 w-20">
          <Image
            src={property.imageUrls[0]!}
            fill
            className="rounded-xl object-cover object-center"
            alt=""
          />
        </div>
        <div className="flex-1">
          <p className="font-bold text-primary">{property.name}</p>
          <p className="text-sm text-muted-foreground">{property.address}</p>
          <p className="text-sm text-muted-foreground">
            {[property.roomType, plural(property.maxNumGuests, "guest")]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
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
