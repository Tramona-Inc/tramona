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

  const updateHostTeam =
    api.hostTeams.updateHostTeamWithOfferPercentage.useMutation();

  const [open, setOpen] = useState(true);

  const { mutateAsync: insertDiscountFromHostOverview } =
    api.properties.insertAndUpdateDiscountForWholeHostTeam.useMutation();
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

  const handleSave = async () => {
    try {
      await insertDiscountFromHostOverview({
        updatedDiscounts: {
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

      localStorage.setItem(
        "discountFields",
        JSON.stringify({
          mondayDiscount,
          tuesdayDiscount,
          wednesdayDiscount,
          thursdayDiscount,
          fridayDiscount,
          saturdayDiscount,
          sundayDiscount,
        }),
      );
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

  return session ? (
    <>
      {hostTeam && hostTeam.hasOfferPercentage === false && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="overflow-hidden bg-white p-0 sm:max-w-[1150px]">
            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col items-center justify-center bg-black p-8 text-white md:w-1/2">
                <div className="w-full max-w-lg">
                  <div className="mb-6">
                    <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                      Congratulations
                      {user?.firstName ? ` ${user.firstName}` : ""}!
                    </h2>
                    <p className="text-sm">
                      This is the first step to truly maximizing the earning
                      potential of your STR
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">
                        Some things you can expect for every booking:
                      </p>
                      <ul className="list-disc space-y-2 pl-6">
                        <li>Protection for damages</li>
                        <li>
                          5-10% less fees on average than Airbnb and other
                          platforms
                        </li>
                        <li>Better customer support than any other platform</li>
                        <li>More bookings</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <p className="text-sm">
                      Thanks for joining Tramona, for any questions reach out to{" "}
                      <a
                        href="mailto:info@tramona.com"
                        className="text-emerald-600 hover:underline"
                      >
                        info@tramona.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:w-1/2">
                <div className="space-y-6 px-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">
                      Before you get started
                    </h3>
                    <p className="text-sm text-gray-500">
                      Set your preferences to ensure you are happy with every
                      request
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">
                        Discount Preferences
                      </Label>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        At 0% off, your current price is equal to your Airbnb
                        price, with less fees. These sliders determine which
                        booking{" "}
                        <strong className="text-black">
                          requests you receive and consider.
                        </strong>
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="font-medium text-gray-900">
                        We generally recommend:
                      </p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-600">
                        <li>3-5% discount for Friday and Saturday bookings</li>
                        <li>
                          5-10% discount for Sunday through Thursday bookings
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(dailyDiscountsConfig).map(
                      ([day, discount]) => (
                        <div key={day} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium capitalize text-gray-700">
                              {day}
                            </Label>
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-medium text-gray-700">
                              {discount}%
                            </span>
                          </div>
                          <Slider
                            value={[discount]}
                            onValueChange={([value]) =>
                              handleDailyDiscountChange(day, value ?? 0)
                            }
                            max={50}
                            step={1}
                            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                          />
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <Button
                  className="mt-6 w-full font-semibold text-white"
                  onClick={handleSave}
                >
                  Save Settings
                </Button>
              </div>
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
