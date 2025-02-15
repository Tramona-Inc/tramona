import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown";

interface DailyDiscounts {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

function DiscountPreferencesSection() {
  const [biddingOpen, setBiddingOpen] = React.useState(false);
  const [weekdayDiscount, setWeekdayDiscount] = React.useState(20);
  const [weekendDiscount, setWeekendDiscount] = React.useState(10);
  const [customizeDaily, setCustomizeDaily] = React.useState(false);
  const [dailyDiscounts, setDailyDiscounts] = React.useState<DailyDiscounts>({
    monday: 20,
    tuesday: 20,
    wednesday: 20,
    thursday: 20,
    friday: 10,
    saturday: 10,
    sunday: 10,
  });

  const handleDailyDiscountChange = (
    day: keyof DailyDiscounts,
    value: number,
  ) => {
    setDailyDiscounts((prev) => ({
      ...prev,
      [day]: value,
    }));
  };

  return (
    <div className="rounded-lg border">
      <CalendarSettingsDropdown
        title="Discount Preferences"
        open={biddingOpen}
        setOpen={setBiddingOpen}
      />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${biddingOpen ? "max-h-[1000px] p-6 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Control the minimum price guests can offer on city requests.
            /night.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Weekday Discount ({weekdayDiscount}%)</Label>
              <Slider
                value={[weekdayDiscount]}
                onValueChange={([value]) => setWeekdayDiscount(value ?? 0)}
                max={50}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Weekend Discount ({weekendDiscount}%)</Label>
              <Slider
                value={[weekendDiscount]}
                onValueChange={([value]) => setWeekendDiscount(value ?? 0)}
                max={50}
                step={1}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Customize per day</Label>
            <Switch
              checked={customizeDaily}
              onCheckedChange={setCustomizeDaily}
            />
          </div>
          {customizeDaily && (
            <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
              {Object.entries(dailyDiscounts).map(([day, discount]) => (
                <div key={day} className="space-y-2">
                  <Label className="capitalize">
                    {day} ({discount}%)
                  </Label>
                  <Slider
                    value={[discount]}
                    onValueChange={([value]) =>
                      handleDailyDiscountChange(
                        day as keyof DailyDiscounts,
                        value ?? 0,
                      )
                    }
                    max={50}
                    step={1}
                  />
                </div>
              ))}
            </div>
          )}
          <Button className="w-full">Save Settings</Button>
        </div>
      </div>
    </div>
  );
}

export default DiscountPreferencesSection;


// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown";
// import { api } from "@/utils/api";
// import { useHostTeamStore } from "@/utils/store/hostTeamStore";
// import { toast } from "@/components/ui/use-toast";
// import { errorToast } from "@/utils/toasts";
// import { type Property } from "@/server/db/schema";
// interface DailyDiscounts {
//   monday: number;
//   tuesday: number;
//   wednesday: number;
//   thursday: number;
//   friday: number;
//   saturday: number;
//   sunday: number;
// }

// export default function DiscountPreferencesSection({ property }: { property: Property }) {
//   const { currentHostTeamId } = useHostTeamStore();
//   const { mutateAsync: updateProperty } = api.properties.update.useMutation();

//   const [biddingOpen, setBiddingOpen] = React.useState(false);
//   const [weekdayDiscount, setWeekdayDiscount] = React.useState(property.weekdayDiscount ?? 20);
//   const [weekendDiscount, setWeekendDiscount] = React.useState(property.weekendDiscount ?? 10);
//   const [customizeDaily, setCustomizeDaily] = React.useState(false);
//   const [dailyDiscounts, setDailyDiscounts] = React.useState<DailyDiscounts>(property.dailyDiscounts ?? {
//     monday: 20,
//     tuesday: 20,
//     wednesday: 20,
//     thursday: 20,
//     friday: 10,
//     saturday: 10,
//     sunday: 10,
//   });

//   const handleDailyDiscountChange = (day: keyof DailyDiscounts, value: number) => {
//     setDailyDiscounts((prev) => ({ ...prev, [day]: value }));
//   };

//   const handleSave = async () => {
//     try {
//       await updateProperty({
//         updatedProperty: {
//           ...property,
//           weekdayDiscount,
//           weekendDiscount,
//           dailyDiscounts,
//         },
//         currentHostTeamId: currentHostTeamId!,
//       });
//       toast({ title: "Discount Preferences Updated!" });
//     } catch (error) {
//       errorToast();
//     }
//   };

//   return (
//     <div className="rounded-lg border">
//       <CalendarSettingsDropdown title="Discount Preferences" open={biddingOpen} setOpen={setBiddingOpen} />

//       <div className={`overflow-hidden transition-all duration-300 ease-in-out ${biddingOpen ? "max-h-[1000px] p-6 opacity-100" : "max-h-0 opacity-0"}`}>
//         <div className="space-y-6">
//           <p className="text-sm text-muted-foreground">Control the minimum price guests can offer.</p>

//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//             <div className="space-y-2">
//               <Label>Weekday Discount ({weekdayDiscount}%)</Label>
//               <Slider value={[weekdayDiscount]} onValueChange={([value]) => setWeekdayDiscount(value ?? 0)} max={50} step={1} />
//             </div>
//             <div className="space-y-2">
//               <Label>Weekend Discount ({weekendDiscount}%)</Label>
//               <Slider value={[weekendDiscount]} onValueChange={([value]) => setWeekendDiscount(value ?? 0)} max={50} step={1} />
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <Label>Customize per day</Label>
//             <Switch checked={customizeDaily} onCheckedChange={setCustomizeDaily} />
//           </div>

//           {customizeDaily && (
//             <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2">
//               {Object.entries(dailyDiscounts).map(([day, discount]) => (
//                 <div key={day} className="space-y-2">
//                   <Label className="capitalize">{day} ({discount}%)</Label>
//                   <Slider value={[discount]} onValueChange={([value]) => handleDailyDiscountChange(day as keyof DailyDiscounts, value ?? 0)} max={50} step={1} />
//                 </div>
//               ))}
//             </div>
//           )}

//           <Button className="w-full" onClick={handleSave}>Save Settings</Button>
//         </div>
//       </div>
//     </div>
//   );
// }
