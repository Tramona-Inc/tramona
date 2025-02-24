import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import React from "react";

export default function BookItNowSection({
  isBookItNowChecked,
  isTogglingBookItNow,
  handleBookItNowSwitch,
  handleBookItNowSlider,
  bookItNowPercent,
  setBookItNowPercent,
}: {
  isBookItNowChecked: boolean;
  isTogglingBookItNow: boolean;
  handleBookItNowSwitch: (checked: boolean) => Promise<void>;
  handleBookItNowSlider: (bookItNowPercent: number) => Promise<number>;
  bookItNowPercent: number;
  setBookItNowPercent: (percent: number) => void;
}) {
  const [previousValue, setPreviousValue] = React.useState(bookItNowPercent);
  const [isError, setIsError] = React.useState(false);
  const [localBookItNowChecked, setLocalBookItNowChecked] =
    React.useState(isBookItNowChecked);
  const [localSliderValue, setLocalSliderValue] =
    React.useState(bookItNowPercent);
  const [isUpdatingSwitch, setIsUpdatingSwitch] = React.useState(false);
  const [hasUserModifiedSlider, setHasUserModifiedSlider] =
    React.useState(false);

  // Only sync slider value with props on initial mount or when explicitly resetting
  React.useEffect(() => {
    // Don't sync if:
    // 1. User has modified the slider OR
    // 2. We're in the middle of toggling the switch
    if (!hasUserModifiedSlider && !isUpdatingSwitch && !isTogglingBookItNow) {
      setLocalSliderValue(bookItNowPercent);
      setPreviousValue(bookItNowPercent);
    }
  }, [
    bookItNowPercent,
    isUpdatingSwitch,
    hasUserModifiedSlider,
    isTogglingBookItNow,
  ]);

  const handleSwitchChange = async (checked: boolean) => {
    setIsUpdatingSwitch(true);
    setLocalBookItNowChecked(checked);
    try {
      await handleBookItNowSwitch(checked);
      // Only reset slider if turning OFF book it now
      if (!checked) {
        setHasUserModifiedSlider(false);
        setLocalSliderValue(bookItNowPercent);
      }
    } catch (error) {
      setLocalBookItNowChecked(!checked);
      console.error("Failed to toggle Book It Now:", error);
    } finally {
      setIsUpdatingSwitch(false);
    }
  };

  const handleSliderChange = (value: number) => {
    setLocalSliderValue(value);
    setHasUserModifiedSlider(true);
  };

  // After successful save, reset the modified flag
  const handleBookItNowSliderLocal = async () => {
    console.log("💾 Save Attempted:", {
      localSliderValue,
      previousValue,
      hasUserModifiedSlider,
    });
    setPreviousValue(localSliderValue);

    try {
      const serverUpdate = handleBookItNowSlider(localSliderValue);
      const newBookItNowPercent = await serverUpdate;
      setLocalSliderValue(newBookItNowPercent);
      setBookItNowPercent(newBookItNowPercent);
      setHasUserModifiedSlider(false); // Reset after successful save
      setIsError(false);
    } catch (error) {
      setLocalSliderValue(previousValue);
      setBookItNowPercent(previousValue);
      setIsError(true);
      console.error("Failed to update Book It Now percentage:", error);
    }
  };

  // Change the save button logic to disable during switch update and when no changes
  const hasChanges = localSliderValue !== bookItNowPercent;
  const isSaveDisabled = !hasChanges || isUpdatingSwitch; // Disable if no changes OR during switch update

  return (
    <div className="space-y-1 rounded-lg border p-6">
      <div className="flex cursor-pointer items-center justify-between">
        <h3 className="text-xl font-bold text-black">Book it now</h3>
      </div>
      <div className="flex flex-row justify-between space-x-1">
        <p className="text-base text-muted-foreground">
          Turn on Book it now to allow guests to book your property instantly.
          All bookings automatically block off the dates on Tramona, Airbnb, and
          Vrbo.
        </p>
        <Switch
          checked={localBookItNowChecked}
          disabled={isTogglingBookItNow}
          className="data-[state=checked]:bg-primaryGreen data-[state=unchecked]:bg-gray-300"
          onCheckedChange={handleSwitchChange}
          style={{ cursor: isTogglingBookItNow ? "wait" : "pointer" }}
        />
      </div>

      {localBookItNowChecked && (
        <div className="space-y-4">
          <div className="my-6 w-full border-b border-gray-200" />
          <Label>{localSliderValue}% OFF</Label>
          <Slider
            value={[localSliderValue]}
            onValueChange={(value) => handleSliderChange(value[0]!)}
            max={80}
          />
          <p className="text-xs text-muted-foreground">
            Hosts that offer a discount on Tramona and keep pricing normal on
            Airbnb see the best results.
          </p>
          <div className="flex flex-col gap-2">
            {isError && (
              <p className="text-sm text-red-500">
                Failed to save changes. Please try again.
              </p>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleBookItNowSliderLocal}
                disabled={isSaveDisabled}
                variant={isError ? "destructive" : "primary"}
              >
                {isError
                  ? "Try Again"
                  : isUpdatingSwitch
                    ? "Please wait..."
                    : hasChanges
                      ? "Save"
                      : "Saved"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
