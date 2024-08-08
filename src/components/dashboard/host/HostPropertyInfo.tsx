import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type Property } from "@/server/db/schema";
import HostPropertiesCancellation from "./HostPropertiesCancellation";
import HostPropertiesDetails from "./HostPropertiesDetails";
import { AlertCircle, ChevronLeft, Edit2, Info } from "lucide-react";
import Link from "next/link";
import HostAvailability from "./HostAvailability";
import { useState } from "react";
import { Label } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import HostPropertiesRestrictions from "./HostPropertiesRestrictions";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
              <Dialog>
                <DialogTrigger className="size-sm inline-flex items-center justify-center text-sm text-muted-foreground underline underline-offset-2">
                  <Info className="size-4" />
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-8">
                  <DialogHeader>
                    <DialogTitle className="mb-4 text-2xl font-bold">
                      How to Sync Your Property&apos;s iCal
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <section>
                      <h3 className="mb-2 text-lg font-semibold">
                        Step 1: Get Your Airbnb iCal Link
                      </h3>
                      <ol className="list-inside list-decimal space-y-1">
                        <li>Log in to your Airbnb account</li>
                        <li>
                          Go to &quot;Manage Listings&quot; from your profile
                          menu
                        </li>
                        <li>Click on the &quot;Calendar&quot; tab</li>
                        <li>Select the property you want to sync</li>
                        <li>
                          On the right-hand side, navigate to
                          &quot;Availability&quot;
                        </li>
                        <li>
                          Scroll to &quot;Connect to another website&quot; and
                          copy the iCal link
                        </li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold">
                        Step 2: Enter the iCal Link on Our Website
                      </h3>
                      <ol className="list-inside list-decimal space-y-1">
                        <li>Log in to your host account on our website</li>
                        <li>
                          Find &quot;Properties&quot; on the left-hand side
                        </li>
                        <li>
                          Navigate to your listing corresponding to the copied
                          iCal
                        </li>
                        <li>Paste the Airbnb iCal link</li>
                        <li>Click &quot;Sync&quot;</li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold">
                        Step 3: Verify the Sync
                      </h3>
                      <ul className="list-inside list-disc space-y-1">
                        <li>Wait a few minutes for synchronization</li>
                        <li>
                          Check that Airbnb bookings appear on our
                          platform&apos;s calendar
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold">
                        Tips for Smooth Syncing
                      </h3>
                      <ul className="list-inside list-disc space-y-1">
                        <li>Keep your iCal link handy for future updates</li>
                        <li>Regularly check for booking conflicts</li>
                      </ul>
                    </section>

                    <p className="text-sm text-muted-foreground">
                      If you have any questions or issues, please contact our
                      support team. Happy hosting!
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
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
              <Dialog>
                <DialogTrigger className="size-sm inline-flex items-center justify-center text-sm text-muted-foreground underline underline-offset-2">
                  <Info className="size-4" />
                </DialogTrigger>
                <DialogContent className="max-w-3xl p-8">
                  <DialogHeader>
                    <DialogTitle className="mb-4 text-2xl font-bold">
                      How to Sync Your Property&apos;s iCal
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <section>
                      <h3 className="mb-2 text-lg font-semibold">
                        Step 1: Get Your Airbnb iCal Link
                      </h3>
                      <ol className="list-inside list-decimal space-y-1">
                        <li>Log in to your Airbnb account</li>
                        <li>
                          Go to &quot;Manage Listings&quot; from your profile
                          menu
                        </li>
                        <li>Click on the &quot;Calendar&quot; tab</li>
                        <li>Select the property you want to sync</li>
                        <li>
                          On the right-hand side, navigate to
                          &quot;Availability&quot;
                        </li>
                        <li>
                          Scroll to &quot;Connect to another website&quot; and
                          copy the iCal link
                        </li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold">
                        Step 2: Enter the iCal Link on Our Website
                      </h3>
                      <ol className="list-inside list-decimal space-y-1">
                        <li>Log in to your host account on our website</li>
                        <li>
                          Find &quot;Properties&quot; on the left-hand side
                        </li>
                        <li>
                          Navigate to your listing corresponding to the copied
                          iCal
                        </li>
                        <li>Paste the Airbnb iCal link</li>
                        <li>Click &quot;Sync&quot;</li>
                      </ol>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold">
                        Step 3: Verify the Sync
                      </h3>
                      <ul className="list-inside list-disc space-y-1">
                        <li>Wait a few minutes for synchronization</li>
                        <li>
                          Check that Airbnb bookings appear on our
                          platform&apos;s calendar
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="mb-2 text-lg font-semibold">
                        Tips for Smooth Syncing
                      </h3>
                      <ul className="list-inside list-disc space-y-1">
                        <li>Keep your iCal link handy for future updates</li>
                        <li>Regularly check for booking conflicts</li>
                      </ul>
                    </section>

                    <p className="text-sm text-muted-foreground">
                      If you have any questions or issues, please contact our
                      support team. Happy hosting!
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
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
