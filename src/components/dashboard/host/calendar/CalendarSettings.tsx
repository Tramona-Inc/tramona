import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HostPropertiesRestrictions from "../HostPropertiesRestrictions";
import { Property } from "@/server/db/schema/tables/properties";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { toast } from "@/components/ui/use-toast";
import RequestAndBidAutomationSection from "./setttingsSections/RequestAndBidAutomationSection";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { errorToast } from "@/utils/toasts";
import * as React from "react";
import HostFeeTab from "./HostFeeTab";

interface CalendarSettingsProps {
  property: Property;
  handleBookItNowSwitch: (checked: boolean) => Promise<void>;
  handleBookItNowSlider: (bookItNowPercent: number) => Promise<void>;
  isUpdatingBookItNow: boolean;
  isBookItNowChecked: boolean;
  refetch: () => void;
}
export default function CalendarSettings({
  property,
  handleBookItNowSwitch,
  handleBookItNowSlider,
  isUpdatingBookItNow,
  isBookItNowChecked,
  refetch,
}: CalendarSettingsProps) {
  const { currentHostTeamId } = useHostTeamStore();

  // <---------------------------------- MUTATIONS ---------------------------------->

  const { mutateAsync: updateRequestToBook } =
    api.properties.updateRequestToBook.useMutation();

  const [bookItNowPercent, setBookItNowPercent] = useState<number>(
    property.bookItNowHostDiscountPercentOffInput,
  );

  const [biddingOpen, setBiddingOpen] = useState(false);
  const [biddingSaved, setBiddingSaved] = useState(false);
  const [biddingPercent, setBiddingPercent] = useState<number>(
    property.requestToBookMaxDiscountPercentage,
  );

  // Local Loading State for switch
  const [isBookItNowSwitchLoading, setIsBookItNowSwitchLoading] =
    useState(false);

  useEffect(() => {
    setBookItNowPercent(property.bookItNowHostDiscountPercentOffInput);
    setBiddingPercent(property.requestToBookMaxDiscountPercentage);
  }, [property]); //update when the selected property changes

  const handleBookItNowSliderLocal = async () => {
    await handleBookItNowSlider(bookItNowPercent);
  };

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
    <Card className="h-full flex-1">
      <CardContent className="p-1 xl:p-3">
        <h2 className="mb-2 text-xl font-bold sm:mb-6 sm:text-2xl">Settings</h2>
        <Tabs defaultValue="pricing" className="w-full">
          <TabsList
            className="mb-4 grid w-full grid-cols-3 sm:mb-6"
            noBorder={true}
          >
            <TabsTrigger value="pricing" className="flex-1">
              Pricing
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex-1">
              Fees
            </TabsTrigger>
            <TabsTrigger value="restrictions" className="flex-1">
              Restrictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pricing" className="space-y-6">
            {/* Book it now section */}
            <div className="space-y-1 rounded-lg border p-6">
              <div className="flex cursor-pointer items-center justify-between">
                <h3 className="text-xl font-bold text-black">Book it now</h3>
              </div>
              <div className="flex flex-row justify-between">
                <p className="text-base text-muted-foreground">
                  Turn on Book it now to allow guests to book your property
                  instantly. All bookings automatically block off the dates on
                  Tramona and Airbnb.
                </p>
                <Switch
                  checked={isBookItNowChecked}
                  disabled={isBookItNowSwitchLoading}
                  className="data-[state=checked]:bg-primaryGreen data-[state=unchecked]:bg-gray-300"
                  onCheckedChange={async (checked) => {
                    setIsBookItNowSwitchLoading(true);
                    await handleBookItNowSwitch(checked).finally(() => {
                      setIsBookItNowSwitchLoading(false);
                    });
                  }}
                />
              </div>

              {isBookItNowChecked && (
                <div className="space-y-4">
                  <div className="my-6 w-full border-b border-gray-200" />
                  <Label>{bookItNowPercent}% OFF</Label>
                  <Slider
                    value={[bookItNowPercent]}
                    onValueChange={(value) => setBookItNowPercent(value[0]!)}
                    max={80}
                  />
                  <p className="text-xs text-muted-foreground">
                    Hosts that offer a discount on Tramona and keep pricing
                    normal on Airbnb see the best results.
                  </p>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleBookItNowSliderLocal}
                      disabled={isUpdatingBookItNow}
                    >
                      {isUpdatingBookItNow ? "Saving!" : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Bidding section */}
            <div className="rounded-lg border">
              <div
                className="flex cursor-pointer items-center justify-between px-6 py-8"
                onClick={() => setBiddingOpen(!biddingOpen)}
              >
                <h3 className="text-[20px] font-bold text-black">Bidding</h3>
                <Button variant="ghost" size="sm">
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-300"
                    style={{
                      transform: biddingOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </Button>
              </div>
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
                    onValueChange={(value) =>
                      setBiddingPercent(Math.max(5, value[0]!))
                    }
                    min={5}
                    max={100}
                    step={1}
                  />
                  <p className="text-base text-muted-foreground">
                    You can think of this as request to book. To ensure you
                    don&apos;t get lowballed, tell us the %off you would
                    consider accepting.
                  </p>
                  <div className="flex justify-end">
                    <Button onClick={handleBiddingSave}>
                      {biddingSaved ? "Saved!" : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Name your price section */}
            <RequestAndBidAutomationSection property={property} />
          </TabsContent>
          <TabsContent value="fees" className="space-y-6 sm:space-y-8">
            <HostFeeTab property={property} refetch={refetch} />
          </TabsContent>
          <TabsContent value="restrictions" className="space-y-6 sm:space-y-8">
            <HostPropertiesRestrictions property={property} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
