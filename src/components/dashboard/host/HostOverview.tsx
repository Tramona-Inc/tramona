import Spinner from "@/components/_common/Spinner";
import HostPropertiesOverview from "./HostPropertiesOverview";
import HostPotentialBookingOverview from "../../host/overview/potential-booking-overview/HostPotentialBookingOverview";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import AttentionOverviewSection from "@/components/host/attention-required/AttentionOverviewSection";
import HostStaysOverview from "@/components/host/overview/HostStaysOverview";
import useSetInitialHostTeamId from "@/components/_common/CustomHooks/useSetInitialHostTeamId";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/utils";
export default function HostOverview() {
  useSetInitialHostTeamId();
  const { currentHostTeamId } = useHostTeamStore();
  const { data: session } = useSession({
    required: true,
  });
  const { data: user } = api.users.getUser.useQuery();
  const { data: hostTeam } = api.hostTeams.getHostTeam.useQuery({
    currentHostTeamId: currentHostTeamId!,
  });

  const updateHostTeam = api.hostTeams.updateHostTeamWithOfferPercentage.useMutation();

  const [open, setOpen] = useState(true);

  const { mutateAsync: insertDiscountFromHostOverview } = api.properties.insertDiscountFromHostOverview.useMutation();
  const [weekdayDiscount, setWeekdayDiscount] = useState(0);
  const [weekendDiscount, setWeekendDiscount] = useState(0);
  const [customizeDaily, setCustomizeDaily] = useState(false);
  const [mondayDiscount, setMondayDiscount] = useState(0);
  const [tuesdayDiscount, setTuesdayDiscount] = useState(0);
  const [wednesdayDiscount, setWednesdayDiscount] = useState(0);
  const [thursdayDiscount, setThursdayDiscount] = useState(0);
  const [fridayDiscount, setFridayDiscount] = useState(0);
  const [saturdayDiscount, setSaturdayDiscount] = useState(0);
  const [sundayDiscount, setSundayDiscount] = useState(0);

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
    try {
      localStorage.setItem("discountFields", JSON.stringify({
        ...JSON.parse(localStorage.getItem("discountFields") ?? "{}") as Record<string, any>,
        isDailyDiscountsCustomized: checked,
      }));
      await insertDiscountFromHostOverview({
        updatedDiscounts: {
          isDailyDiscountsCustomized: checked,
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
      await insertDiscountFromHostOverview({
        updatedDiscounts: {
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

      localStorage.setItem("discountFields", JSON.stringify({
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
      }));
      void updateHostTeam.mutate({
        id: currentHostTeamId!,
      });
      toast({ title: "Discount Preferences Updated!" });
      setOpen(false);
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

  const mutedClasses = customizeDaily ? "opacity-50 text-gray-500 cursor-not-allowed" : "";
  // const onSubmit = async (data: { offerPercentage: number }) => {
  //   updateHostTeam.mutate({
  //     id: currentHostTeamId!,
  //     offerPercentage: data.offerPercentage,
  //   });
  //   setOpen(false);
  // };
  return session ? (
    <>
      {hostTeam && hostTeam.hasOfferPercentage === false && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogTitle>Discount Preferences</DialogTitle>
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
                  {Object.entries(dailyDiscountsConfig).map(
                    ([day, discount]) => (
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
                    ),
                  )}
                </div>
              )}

              <Button className="w-full" onClick={handleSave}>
                {" "}
                {/* Disable Save when customizeDaily is on, if that's desired behavior */}
                Save Settings
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="mx-auto mt-8 min-h-screen-minus-header max-w-8xl space-y-20 p-4 pb-32">
        <div className="space-y-8 lg:space-y-20">
          <h1 className="text-3xl font-semibold md:text-5xl">
            Welcome back, {user?.firstName ? user.firstName : "Host"}!{" "}
          </h1>
          <AttentionOverviewSection currentHostTeamId={currentHostTeamId} />
        </div>

        <HostStaysOverview currentHostTeamId={currentHostTeamId} />
        <HostPotentialBookingOverview
          currentHostTeamId={currentHostTeamId}
          className="flex-col lg:flex lg:flex-1"
        />
        <div className="flex flex-col gap-4 lg:flex-row">
          <HostPropertiesOverview currentHostTeamId={currentHostTeamId} />
        </div>
      </div>
    </>
  ) : (
    <Spinner />
  );
}

// add more spacking on bottom of reservatiions
