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

export default function Page() {
  const [open, setOpen] = useState(false);

  const { data: properties } = api.properties.getHostProperties.useQuery();

  return (
    <DashboadLayout type="host">
      <div className="px-4 pb-32 pt-16">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">Properties</h1>
            <NewPropertyBtn open={open} setOpen={setOpen} />
          </div>
          {properties ? (
            properties.length > 0 ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {properties?.map((property) => (
                  <PropertyCard key={property.id} property={property} />
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
    </DashboadLayout>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="flex overflow-clip rounded-xl border-zinc-100 bg-card shadow-md">
      <div className="relative w-32">
        <Image
          src={property.imageUrls[0]!}
          fill
          className="object-cover object-center"
          alt=""
        />
      </div>
      <div className="flex-1 p-4">
        <p className="font-medium">{property.name}</p>
        <p className="text-sm text-muted-foreground">{property.address}</p>
        <p className="text-sm text-muted-foreground">
          {[property.roomType, plural(property.maxNumGuests, "guest")]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </div>
      <div className="p-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="rounded-full">
              <DotsVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <EditIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <EyeOffIcon />
              Unlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function NewPropertyBtn({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="pl-3">
          <PlusIcon />
          Add a Property
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your Property</DialogTitle>
          <DialogDescription>
            Please input all the information necessary for travellers to start
            booking with your property.
          </DialogDescription>
        </DialogHeader>
        <HostPropertyForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
