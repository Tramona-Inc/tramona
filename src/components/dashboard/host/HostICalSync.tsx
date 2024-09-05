import { type Property } from "@/server/db/schema";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HostICalHowToDialog from "./HostICalHowToDialog";
import { Label } from "@/components/ui/label";
import { Copy, Edit2 } from "lucide-react";

export default function HostICalSync({ property }: { property: Property }) {
  const [iCalLink, setiCalLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const { mutateAsync: syncCalendar, isLoading } =
    api.calendar.syncCalendar.useMutation();

  const handleFormSubmit = async () => {
    try {
      await syncCalendar({
        iCalLink,
        propertyId: property.id,
        platformBookedOn: "airbnb",
      });
      setiCalLink("");
      setIsEditing(false);
      toast({
        title: "Success!",
        description: "Your iCal calendar has been successfully synced.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error syncing calendar:", error);
      toast({
        title: "No calendar data found",
        description:
          "Please make sure the iCal URL is correct and try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setiCalLink(property.iCalLink ?? "");
    }
    setIsEditing(!isEditing);
  };

  const handleCopyICalLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://tramona.com/api/ics/${property.id}`,
      );
      toast({
        title: "Copied!",
        description: "The iCal link has been copied to your clipboard.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to copy text: ", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy the iCal link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="">
          {property.iCalLink && (
            <Button variant="secondary">Edit iCal Link</Button>
          )}

          {!property.iCalLink && <Button size={"lg"}>Sync your iCal</Button>}
        </DialogTrigger>
        <DialogContent className="max-w-3xl p-8">
          <DialogHeader>
            <DialogTitle>
              <h1 className="mb-8 text-4xl font-bold">Sync your iCal</h1>
            </DialogTitle>
          </DialogHeader>
          <div className="mb-10 space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="font-semibold">Airbnb iCal URL</Label>
              <HostICalHowToDialog />
            </div>
            {property.iCalLink && (
              <>
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
              </>
            )}
            {!property.iCalLink && (
              <>
                <Input
                  id="iCalLink"
                  type="url"
                  placeholder="https://example.com/calendar.ics"
                  value={iCalLink}
                  onChange={(e) => setiCalLink(e.target.value)}
                />
                <Button onClick={handleFormSubmit} disabled={isLoading}>
                  {isLoading ? "Syncing..." : "Submit"}
                </Button>
              </>
            )}

            {isEditing && (
              <Button
                onClick={() => void handleFormSubmit()}
                className="mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Syncing..." : "Submit"}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="font-semibold">Tramona iCal URL</Label>
              <HostICalHowToDialog />
            </div>
            <Input
              id="tramonaICalLink"
              type="url"
              readOnly
              value={`https://tramona.com/api/ics/${property.id}`}
            />
            <Button
              onClick={handleCopyICalLink}
              className="rounded-r bg-blue-500 p-2 text-white hover:bg-blue-600"
            >
              <Copy className="h-5 w-5" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
