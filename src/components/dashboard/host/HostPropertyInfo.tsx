import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Property } from "@/server/db/schema";
import HostPropertiesPriceRestriction from "./HostPropertiesPriceRestriction";
import HostPropertiesCancellation from "./HostPropertiesCancellation";

export default function HostPropertyInfo({
  property,
}: {
  property: Property | null;
}) {
  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">{property?.name}</h1>
        <p className="font-semibold text-muted-foreground">
          {property?.address}
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
          <p>Details stuff</p>
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
