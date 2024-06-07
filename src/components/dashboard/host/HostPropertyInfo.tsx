import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Property } from "@/server/db/schema";
import HostPropertiesPriceRestriction from "./HostPropertiesPriceRestriction";
import HostPropertiesCancellation from "./HostPropertiesCancellation";
import HostPropertiesDetails from "./HostPropertiesDetails";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function HostPropertyInfo({ property }: { property: Property }) {
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Link href="/host/properties" className="sm:hidden">
        <ChevronLeft />
      </Link>
      <div>
        <h1 className="text-2xl font-bold">{property.name}</h1>
        <p className="font-semibold text-muted-foreground">
          {property.address}
        </p>
      </div>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger
            value="details"
            className="data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Listing details
          </TabsTrigger>
          <TabsTrigger
            value="price"
            className="data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Price restriction
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Availability
          </TabsTrigger>
          <TabsTrigger
            value="cancellation"
            className="data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Cancellation policy
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <HostPropertiesDetails property={property} />
        </TabsContent>
        <TabsContent value="price">
          <HostPropertiesPriceRestriction />
        </TabsContent>
        <TabsContent value="availability">
          <p>Availability stuff</p>
        </TabsContent>
        <TabsContent value="cancellation">
          <HostPropertiesCancellation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
