import DashboadLayout from "@/components/_common/Layout/DashboardLayout";
import HostPropertyForm from "@/components/host/HostPropertyForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Property } from "@/server/db/schema/tables/properties";
import { api } from "@/utils/api";
import { useState } from "react";

function PropertyCard({ property }: { property: Property }) {
  // TODO: display the property correctly
  return (
    <Card>
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardTitle>Host</CardTitle>
      </CardContent>
    </Card>
  );
}

export default function Properties() {
  const [open, setOpen] = useState(false);

  const { data: properties } = api.properties.getHostProperties.useQuery();

  return (
    <DashboadLayout type="host">
      <div className="mx-10 flex flex-row justify-between">
        <h1 className="text-4xl font-bold">Properties</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add a Property</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add your Property</DialogTitle>
              <DialogDescription>
                Please input all the information necessary for travellers to
                start booking with your property.
              </DialogDescription>
            </DialogHeader>
            <HostPropertyForm setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        {properties?.map((property) => {
          return <PropertyCard key={property.id} property={property} />;
        })}
      </div>
    </DashboadLayout>
  );
}
