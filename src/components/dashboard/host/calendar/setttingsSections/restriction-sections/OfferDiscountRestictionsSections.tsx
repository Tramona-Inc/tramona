import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown";
import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { Property } from "@/server/db/schema/tables/properties";
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

  const handleSave = async () => {
    try {
      await updateDiscounts({
        updatedDiscounts: {
          propertyId: property.id,
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

          <Button className="w-full" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
