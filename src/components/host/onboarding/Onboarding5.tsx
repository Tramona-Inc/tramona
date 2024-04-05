import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { cn } from "@/utils/utils";
import { useState } from "react";

export default function Onboarding4() {
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState("");

  const checkInType = useHostOnboarding((state) => state.listing.checkInType);
  const setCheckInType = useHostOnboarding((state) => state.setCheckInType);

  const handleRadioChange = (value: string) => {
    if (value === "self" || value === "host") {
      setIsOther(false);
      setCheckInType(value); // Set check-in type for other options
    } else {
      setIsOther(true);
      setCheckInType(""); // Clear check-in type when "Other" is selected
    }
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherValue(e.target.value);
    setCheckInType(e.target.value);
  };

  return (
    <div className="mb-5 flex w-full flex-col items-center justify-center gap-5 max-lg:container">
      <div className="mt-10 flex flex-col gap-10">
        <h1 className="text-4xl font-bold">
          How will your guest check-in / out?
        </h1>

        <div className="flex flex-col gap-5">
          <RadioGroup
            defaultValue={checkInType}
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
                !isOther && "text-muted-foreground",
                "mb-2 text-sm font-semibold",
              )}
            >
              Other: please specify here
            </p>
            <Input
              type="text"
              disabled={!isOther}
              value={otherValue}
              onChange={handleOtherInputChange}
            />
            {/* //TODO display the character count */}
          </div>
        </div>

        <div className="mt-5 w-full">
          <h1 className="mb-2 text-xl font-bold">Hours</h1>
          <div className="grid grid-cols-2 gap-5">
            <Input type="clock" placeholder="Check in time" className="p-5" />
            <Input type="clock" placeholder="Check out time" className="p-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
