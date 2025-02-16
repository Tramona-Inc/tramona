import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown";
import { errorToast } from "@/utils/toasts";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { Property } from "@/server/db/schema/tables/properties";
export default function BiddingSection({
  property,
  biddingPercent,
  setBiddingPercent,
}: {
  property: Property;
  biddingPercent: number;
  setBiddingPercent: (percent: number) => void;
}) {
  const { currentHostTeamId } = useHostTeamStore();
  const [biddingOpen, setBiddingOpen] = useState(false);
  const [biddingSaved, setBiddingSaved] = useState(false);

  const { mutateAsync: updateRequestToBook } =
    api.properties.updateRequestToBook.useMutation();
  const handleBiddingSave = async () => {
    setBiddingSaved(true);
    setTimeout(() => setBiddingSaved(false), 2000);
    await updateRequestToBook({
      propertyId: property.id,
      requestToBookMaxDiscountPercentage: biddingPercent,
      currentHostTeamId: currentHostTeamId!,
    })
      .then(() => {
        toast({
          title: "Successfully updated book it now percentage!",
        });
      })
      .catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.data?.code === "FORBIDDEN") {
          toast({
            title:
              "You do not have permission to edit overall pricing strategy.",
            description: "Please contact your team owner to request access.",
          });
        } else {
          errorToast();
        }
      });
  };

  return (
    <div className="rounded-lg border">
      <CalendarSettingsDropdown
        title="Bidding"
        description="Set the maximum discount percentage you would consider accepting for a booking request."
        open={biddingOpen}
        setOpen={setBiddingOpen}
      />
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${biddingOpen ? "-mt-4 max-h-[1000px] p-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <p className="text-base font-semibold">
          What prices would you consider accepting?
        </p>
        <div className="-mx-6 mt-4 w-[calc(100%+3rem)] border-b border-gray-200" />
        <div className="space-y-4 pt-4">
          <div className="text-lg font-medium">
            <Label>{biddingPercent}% off Airbnb Prices</Label>
          </div>
          <Slider
            value={[biddingPercent]}
            onValueChange={(value) => setBiddingPercent(Math.max(5, value[0]!))}
            min={5}
            max={100}
            step={1}
          />
          <p className="text-base text-muted-foreground">
            You can think of this as request to book. To ensure you don&apos;t
            get lowballed, tell us the %off you would consider accepting.
          </p>
          <div className="flex justify-end">
            <Button
              onClick={handleBiddingSave}
              disabled={
                biddingPercent === property.requestToBookMaxDiscountPercentage
              }
            >
              {biddingSaved ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
