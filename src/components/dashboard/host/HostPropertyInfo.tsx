import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Property } from "@/server/db/schema";
import HostPropertiesCancellation from "./HostPropertiesCancellation";
import HostPropertiesDetails from "./HostPropertiesDetails";
import { AlertCircle } from "lucide-react";
import HostAvailability from "./HostAvailability";
import HostPropertiesRestrictions from "./HostPropertiesRestrictions";
import HostAutoOffer from "./HostAutoOffer";
import HostBookItNow from "./HostBookItNow";
import HostPolicySection from "./HostPolicySection";
import HostArrivalGuide from "./HostArrivalGuide";

export default function HostPropertyInfo({ property }: { property: Property }) {
  return (
    <div key={property.id} className="space-y-4">
      <h1 className="text-2xl font-bold">Properties editor</h1>
      <Tabs defaultValue="details">
        <TabsList noBorder>
          <TabsTrigger
            value="details"
            className="w-1/2 data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Details
          </TabsTrigger>
          {/* <TabsTrigger
            value="restrictions"
            className="data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Restrictions
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Availability
          </TabsTrigger> */}
          <TabsTrigger
            value="policy"
            className="relative w-1/2 data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Policy
            {!property.cancellationPolicy && (
              <AlertCircle
                className="absolute right-0 top-0 text-red-600"
                size={16}
              />
            )}
          </TabsTrigger>
          <TabsTrigger
            value="arrival-guide"
            className="w-1/2 data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Arrival Guide
          </TabsTrigger>
          {/* <TabsTrigger
            value="auto-offer"
            className="data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Auto-offer
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="details" className="">
          <HostPropertiesDetails property={property} />
        </TabsContent>
        <TabsContent value="restrictions">
          <HostPropertiesRestrictions
            property={property}
            key={`restrictions-${property.id}`}
          />
        </TabsContent>
        <TabsContent value="availability">
          <HostAvailability property={property} />
        </TabsContent>
        <TabsContent value="policy">
          <HostPolicySection property={property} />
        </TabsContent>
        <TabsContent value="auto-offer">
          <HostAutoOffer property={property} />
        </TabsContent>
        <TabsContent value="book-it-now">
          <HostBookItNow property={property} />
        </TabsContent>
        <TabsContent value="arrival-guide">
          <HostArrivalGuide property={property} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
