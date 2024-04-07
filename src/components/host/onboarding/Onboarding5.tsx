import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { cn } from "@/utils/utils";

export default function Onboarding4() {
  const otherCheckInType = useHostOnboarding(
    (state) => state.listing.otherCheckInType,
  );

  const setOtherCheckInType = useHostOnboarding(
    (state) => state.setOtherCheckInType,
  );

  const checkInType = useHostOnboarding((state) => state.listing.checkInType);
  const setCheckInType = useHostOnboarding((state) => state.setCheckInType);

  const handleRadioChange = (value: string) => {
    if (value === "self" || value === "host") {
      setOtherCheckInType(false);
      setCheckInType(value); // Set check-in type for other options
    } else {
      setOtherCheckInType(true);
      setCheckInType(""); // Clear check-in type when "Other" is selected
    }
  };

  // const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setOtherValue(e.target.value);
  //   setCheckInType(e.target.value);
  // };

  const checkIn = useHostOnboarding((state) => state.listing.checkIn);
  const checkOut = useHostOnboarding((state) => state.listing.checkOut);
  const setCheckIn = useHostOnboarding((state) => state.setCheckIn);
  const setCheckOut = useHostOnboarding((state) => state.setCheckOut);
return (
    <div className="mb-5 flex w-full flex-col items-center justify-center gap-5 max-lg:container">
      <div className="mt-10 flex flex-col gap-10">
        <h1 className="text-4xl font-bold">
          How will your guest check-in / out?
        </h1>

        <div className="flex flex-col gap-5">
          <RadioGroup
            defaultValue={otherCheckInType ? "other" : checkInType}
            onValueChange={handleRadioChange}
          >
            <div className="flex items-center space-x-2 rounded-lg border p-5">
              <RadioGroupItem value="self" id="self" />
              <Label htmlFor="self">
                <h2 className="mb-2 text-lg font-bold">Self check-in / out</h2>
                <p className="text-muted-foreground">
                  Guests can check in and out by themselves
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-5">
              <RadioGroupItem value="host" id="host" />
              <Label htmlFor="meet">
                <h2 className="text-lg font-bold">Meet host at door</h2>
                <p className="text-muted-foreground">
                  Guests get the keys from you when they arrive at the property
                </p>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-lg border p-5">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="option-two" className="text-lg font-bold">
                Other
              </Label>
            </div>
          </RadioGroup>

          <div>
            <p
              className={cn(
                !otherCheckInType && "text-muted-foreground",
                "mb-2 text-sm font-semibold",
              )}
            >
              Other: please specify here
            </p>
            <Input
              type="text"
              disabled={!otherCheckInType}
              value={otherCheckInType ? checkInType : ""}
              onChange={(e) => setCheckInType(e.target.value)}
            />
            {/* //TODO display the character count */}
          </div>
        </div>

        <div className="mt-5 w-full">
          <h1 className="mb-2 text-xl font-bold">Hours</h1>
          <div className="grid grid-cols-2 gap-5">
            <Input
              type="clock"
              value={checkIn}
              placeholder="Check in time"
              className="p-5"
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <Input
              type="clock"
              value={checkOut}
              placeholder="Check out time"
              className="p-5"
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
