import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown";
import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { Property } from "@/server/db/schema/tables/properties";
import { cn } from "@/utils/utils";
import { useState, useEffect } from "react";
import { PropertyDiscounts } from "@/server/db/schema/tables/properties";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscountPreferencesSection({
  property,
  discountInfo,
  isLoadingDiscountInfo,
}: {
  property: Property;
  discountInfo: PropertyDiscounts | undefined;
  isLoadingDiscountInfo: boolean;
}) {
  const { currentHostTeamId } = useHostTeamStore();

  const { mutateAsync: updateDiscounts } =
    api.properties.updateDiscounts.useMutation();

  const [biddingOpen, setBiddingOpen] = useState(false);
  const [weekdayDiscount, setWeekdayDiscount] = useState(
    discountInfo?.weekdayDiscount ?? 0,
  );
  const [weekendDiscount, setWeekendDiscount] = useState(
    discountInfo?.weekendDiscount ?? 0,
  );
  const [customizeDaily, setCustomizeDaily] = useState(
    discountInfo?.isDailyDiscountsCustomized ?? false,
  );
  const [mondayDiscount, setMondayDiscount] = useState(
    discountInfo?.mondayDiscount ?? 0,
  );
  const [tuesdayDiscount, setTuesdayDiscount] = useState(
    discountInfo?.tuesdayDiscount ?? 0,
  );
  const [wednesdayDiscount, setWednesdayDiscount] = useState(
    discountInfo?.wednesdayDiscount ?? 0,
  );
  const [thursdayDiscount, setThursdayDiscount] = useState(
    discountInfo?.thursdayDiscount ?? 0,
  );
  const [fridayDiscount, setFridayDiscount] = useState(
    discountInfo?.fridayDiscount ?? 0,
  );
  const [saturdayDiscount, setSaturdayDiscount] = useState(
    discountInfo?.saturdayDiscount ?? 0,
  );
  const [sundayDiscount, setSundayDiscount] = useState(
    discountInfo?.sundayDiscount ?? 0,
  );

  const showLoading = biddingOpen && isLoadingDiscountInfo;

  useEffect(() => {
    if (discountInfo) {
      setWeekdayDiscount(discountInfo.weekdayDiscount);
      setWeekendDiscount(discountInfo.weekendDiscount);
      setCustomizeDaily(discountInfo.isDailyDiscountsCustomized);
      setMondayDiscount(discountInfo.mondayDiscount);
      setTuesdayDiscount(discountInfo.tuesdayDiscount);
      setWednesdayDiscount(discountInfo.wednesdayDiscount);
      setThursdayDiscount(discountInfo.thursdayDiscount);
      setFridayDiscount(discountInfo.fridayDiscount);
      setSaturdayDiscount(discountInfo.saturdayDiscount);
      setSundayDiscount(discountInfo.sundayDiscount);
    }
  }, [discountInfo]);

  const handleDailyDiscountChange = (dayOfWeek: string, value: number) => {
    switch (dayOfWeek) {
      case "monday":
        setMondayDiscount(value);
        break;
      case "tuesday":
        setTuesdayDiscount(value);
        break;
      case "wednesday":
        setWednesdayDiscount(value);
        break;
      case "thursday":
        setThursdayDiscount(value);
        break;
      case "friday":
        setFridayDiscount(value);
        break;
      case "saturday":
        setSaturdayDiscount(value);
        break;
      case "sunday":
        setSundayDiscount(value);
        break;
      default:
        break;
    }
  };

  const handleCustomizeDailyChange = async (checked: boolean) => {
    setCustomizeDaily(checked);
    setWeekdayDiscount(0);
    setWeekendDiscount(0);
    try {
      await updateDiscounts({
        // Call the new mutation for switch
        updatedDiscounts: {
          propertyId: property.id,
          isDailyDiscountsCustomized: checked,
          weekdayDiscount: 0,
          weekendDiscount: 0,
        },
        currentHostTeamId: currentHostTeamId!,
      });
      // if (checked) {
      //   toast({ title: "Daily Discounts On!" });
      // } else {
      //   toast({ title: "Daily Discounts Off!" });
      // }
    } catch (error) {
      setCustomizeDaily(!checked); // Revert UI on error
      errorToast();
    }
  };

  const handleSave = async () => {
    try {
      await updateDiscounts({
        updatedDiscounts: {
          propertyId: property.id,
          weekdayDiscount,
          weekendDiscount,
          isDailyDiscountsCustomized: customizeDaily,
          mondayDiscount,
          tuesdayDiscount,
          wednesdayDiscount,
          thursdayDiscount,
          fridayDiscount,
          saturdayDiscount,
          sundayDiscount,
        },
        currentHostTeamId: currentHostTeamId!,
      });
      toast({ title: "Discount Preferences Updated!" });
    } catch (error) {
      errorToast();
    }
  };

  const dailyDiscountsConfig = {
    monday: mondayDiscount,
    tuesday: tuesdayDiscount,
    wednesday: wednesdayDiscount,
    thursday: thursdayDiscount,
    friday: fridayDiscount,
    saturday: saturdayDiscount,
    sunday: sundayDiscount,
  };

  const mutedClasses = customizeDaily
    ? "opacity-50 text-gray-500 cursor-not-allowed"
    : "";

  const SliderSkeleton = () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[120px]" />
      <Skeleton className="h-8 rounded-full" />
    </div>
  );

  if (showLoading) {
    return (
      <div className="rounded-lg border">
        <CalendarSettingsDropdown
          title="Discount Preferences"
          description="Loading settings..."
          open={biddingOpen}
          setOpen={setBiddingOpen}
        />
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SliderSkeleton />
              <SliderSkeleton />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[160px]" />
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <CalendarSettingsDropdown
        title="Discount Preferences"
        description="Control the minimum price guests can offer."
        open={biddingOpen}
        setOpen={setBiddingOpen}
      />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${biddingOpen ? "max-h-[1000px] p-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className={cn(customizeDaily && mutedClasses)}>
                Weekday Discount ({weekdayDiscount}%)
              </Label>
              <Slider
                value={[weekdayDiscount]}
                onValueChange={([value]) => setWeekdayDiscount(value ?? 0)}
                max={50}
                step={1}
                disabled={customizeDaily} // Disable when customizeDaily is true
                className={cn(customizeDaily && mutedClasses)} // Gray out visually
              />
            </div>
            <div className="space-y-2">
              <Label className={cn(customizeDaily && mutedClasses)}>
                Weekend Discount ({weekendDiscount}%)
              </Label>
              <Slider
                value={[weekendDiscount]}
                onValueChange={([value]) => setWeekendDiscount(value ?? 0)}
                max={50}
                step={1}
                disabled={customizeDaily} // Disable when customizeDaily is true
                className={cn(customizeDaily && mutedClasses)} // Gray out visually
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>
              {customizeDaily
                ? "Customize per day (Overrides Weekday/Weekend)"
                : "Customize per day"}{" "}
              {/* Clearer Label */}
            </Label>
            <Switch
              checked={customizeDaily}
              onCheckedChange={handleCustomizeDailyChange}
            />{" "}
            {/* Use separate handler */}
          </div>

          {customizeDaily && (
            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
              {Object.entries(dailyDiscountsConfig).map(([day, discount]) => (
                <div key={day} className="space-y-2">
                  <Label className="capitalize">
                    {day} ({discount}%)
                  </Label>
                  <Slider
                    value={[discount]}
                    onValueChange={([value]) =>
                      handleDailyDiscountChange(day, value ?? 0)
                    }
                    max={50}
                    step={1}
                  />
                </div>
              ))}
            </div>
          )}

          <Button className="w-full" onClick={handleSave}>
            {" "}
            {/* Disable Save when customizeDaily is on, if that's desired behavior */}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
