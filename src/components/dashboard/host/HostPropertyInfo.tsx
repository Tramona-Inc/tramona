import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Property } from "@/server/db/schema";
import HostPropertiesPriceRestriction from "./HostPropertiesAgeRestriction";
import HostPropertiesCancellation from "./HostPropertiesCancellation";
import HostPropertiesDetails from "./HostPropertiesDetails";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import HostAvailability from "./HostAvailability";
import HostPropertiesAgeRestriction from "./HostPropertiesAgeRestriction";
import { useState } from "react";
import axios from "axios";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";



export default function HostPropertyInfo({ property }: { property: Property }) {
  const [iCalUrl, setICalUrl] = useState("");
  // const [bookedDates, setBookedDates] = useState([]);
  const { toast } = useToast();


  async function handleFormSubmit() {
    try {
      const response = await axios.post('/api/calendar-sync', { iCalUrl, propertyId: property.id });

      if (response.status === 200) {
        // const dates = response.data.dates;
        // setBookedDates(dates);
        setICalUrl("");

        toast({
          title: "Success!",
          description: "Your iCal calendar has been successfully synced.",
          variant: "default",
        });
      } else {
        throw new Error("Failed to sync calendar");
      }
    } catch (error) {
      console.error('Error syncing calendar:', error);
      
      toast({
        title: "Sync Failed",
        description: "An error occurred while syncing the calendar.",
        variant: "destructive",
      });
    }
  }



  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Link href="/host/properties" className="xl:hidden">
        <ChevronLeft />
      </Link>
      <div>
      <div className="space-y-4 mb-10">
        <h1 className="text-4xl font-bold">
          Sync your iCal
        </h1>
        <Label className="font-semibold">iCal URL</Label>
        <Input
          id="iCalUrl"
          type="url"
          placeholder="https://example.com/calendar.ics"
          value={iCalUrl}
          onChange={(e) => setICalUrl(e.target.value)}
        />
        <Button onClick={handleFormSubmit}>Submit</Button>
      </div>
        <h1 className="text-2xl font-bold">
          {property.name === "" ? "No property name provided" : property.name}
        </h1>
        <p className="font-semibold text-muted-foreground">
          {property.address === ", ,   , "
            ? "No address provided"
            : property.address}
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
            value="age"
            className="data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Age restriction
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
        <TabsContent value="age">
          <HostPropertiesAgeRestriction
            property={property}
            key={`age-${property.id}`}
          />
        </TabsContent>
        <TabsContent value="availability">
          <HostAvailability property={property} />
        </TabsContent>
        <TabsContent value="cancellation">
          <HostPropertiesCancellation property={property} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
