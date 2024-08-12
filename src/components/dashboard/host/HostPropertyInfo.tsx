import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Property } from "@/server/db/schema";
import HostPropertiesCancellation from "./HostPropertiesCancellation";
import HostPropertiesDetails from "./HostPropertiesDetails";
import { AlertCircle, ChevronLeft, Edit2 } from "lucide-react";
import Link from "next/link";
import HostAvailability from "./HostAvailability";
import { useState } from "react";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import HostPropertiesRestrictions from "./HostPropertiesRestrictions";
import HostICalHowToDialog from "./HostICalHowToDialog";

export default function HostPropertyInfo({ property }: { property: Property }) {
  const [iCalLink, setiCalLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const syncCalendarMutation = api.calendar.syncCalendar.useMutation({
    onSuccess: () => {
      setiCalLink("");
      setIsEditing(false);
      toast({
        title: "Success!",
        description: "Your iCal calendar has been successfully synced.",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Error syncing calendar:", error);
      toast({
        title: "Sync Failed",
        description:
          error.message || "An error occurred while syncing the calendar.",
        variant: "destructive",
      });
    },
  });

  function handleFormSubmit() {
    syncCalendarMutation.mutate({
      iCalLink,
      propertyId: property.id,
    });
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setiCalLink(property.iCalLink ?? "");
    }
    setIsEditing(!isEditing);
  };

  return (
    <div key={property.id} className="space-y-4 p-4 sm:p-6">
      <Link href="/host/properties" className="xl:hidden">
        <ChevronLeft />
      </Link>
      <div>
        {!property.iCalLink && (
          <div className="mb-10 space-y-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-4xl font-bold">Sync your iCal</h1>
              <HostICalHowToDialog />
            </div>
            <Input
              id="iCalLink"
              type="url"
              placeholder="https://example.com/calendar.ics"
              value={iCalLink}
              onChange={(e) => setiCalLink(e.target.value)}
            />
            <Button
              onClick={handleFormSubmit}
              disabled={syncCalendarMutation.isLoading}
            >
              {syncCalendarMutation.isLoading ? "Syncing..." : "Submit"}
            </Button>
          </div>
        )}
        {property.iCalLink && (
          <div className="mb-10 space-y-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-4xl font-bold">Sync your iCal</h1>
              <HostICalHowToDialog />
            </div>

            <Label className="font-semibold">iCal URL</Label>
            <Input
              id="iCalLink"
              type="url"
              placeholder="https://example.com/calendar.ics"
              value={isEditing ? iCalLink : property.iCalLink}
              onChange={(e) => setiCalLink(e.target.value)}
              readOnly={!isEditing}
              className={isEditing ? "" : "bg-gray-100"}
            />
            <Button
              onClick={handleEditToggle}
              variant="outline"
              className="mr-2"
            >
              {isEditing ? "Cancel" : <Edit2 className="h-4 w-4" />}
            </Button>
            {isEditing && (
              <Button
                onClick={handleFormSubmit}
                className="mt-2"
                disabled={syncCalendarMutation.isLoading}
              >
                {syncCalendarMutation.isLoading ? "Syncing..." : "Submit"}
              </Button>
            )}
          </div>
        )}

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
          </TabsTrigger>
          <TabsTrigger
            value="cancellation"
            className="relative data-[state=active]:border-b-teal-900 data-[state=active]:font-bold data-[state=active]:text-teal-900"
          >
            Cancellation policy
            {!property.cancellationPolicy && (
              <AlertCircle
                className="absolute right-0 top-0 text-red-600"
                size={16}
              />
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
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
        <TabsContent value="cancellation">
          <HostPropertiesCancellation property={property} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
