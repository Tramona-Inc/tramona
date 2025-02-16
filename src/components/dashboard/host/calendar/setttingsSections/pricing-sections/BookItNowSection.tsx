import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function BookItNowSection({
  isBookItNowChecked,
  isTogglingBookItNow,
  handleBookItNowSwitch,
  isUpdatingBookItNow,
  handleBookItNowSlider,
  isBookItNowSaveDisabled,
  bookItNowPercent,
  setBookItNowPercent,
}: {
  isBookItNowChecked: boolean;
  isTogglingBookItNow: boolean;
  handleBookItNowSwitch: (checked: boolean) => Promise<void>;
  handleBookItNowSlider: (bookItNowPercent: number) => Promise<number>;
  isUpdatingBookItNow: boolean;
  isBookItNowSaveDisabled: boolean;
  bookItNowPercent: number;
  setBookItNowPercent: (percent: number) => void;
}) {
  const handleBookItNowSliderLocal = async () => {
    const newBookItNowPercent = await handleBookItNowSlider(bookItNowPercent);
    setBookItNowPercent(newBookItNowPercent);
  };

  return (
    <div className="space-y-1 rounded-lg border p-6">
      <div className="flex cursor-pointer items-center justify-between">
        <h3 className="text-xl font-bold text-black">Book it now</h3>
      </div>
      <div className="flex flex-row justify-between space-x-1">
        <p className="text-base text-muted-foreground">
          Turn on Book it now to allow guests to book your property instantly.
          All bookings automatically block off the dates on Tramona and Airbnb.
        </p>
        <Switch
          checked={isBookItNowChecked}
          disabled={isTogglingBookItNow}
          className="data-[state=checked]:bg-primaryGreen data-[state=unchecked]:bg-gray-300"
          onCheckedChange={async (checked) => {
            await handleBookItNowSwitch(checked);
          }}
          style={{ cursor: isTogglingBookItNow ? "wait" : "auto" }}
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
            Hosts that offer a discount on Tramona and keep pricing normal on
            Airbnb see the best results.
          </p>
          <div className="flex justify-end">
            <Button
              onClick={handleBookItNowSliderLocal}
              disabled={isUpdatingBookItNow || isBookItNowSaveDisabled}
            >
              {isUpdatingBookItNow ? "Saving!" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
