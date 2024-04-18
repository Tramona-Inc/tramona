import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { cn } from "@/utils/utils";
import { Dot } from "lucide-react";
import { useState } from "react";

export default function Summary4() {
  const [isEditing, setIsEditing] = useState(false);

  const { listing } = useHostOnboarding((state) => state);

  const otherCheckInType = useHostOnboarding(
    (state) => state.listing.otherCheckInType,
  );
  const setOtherCheckInType = useHostOnboarding(
    (state) => state.setOtherCheckInType,
  );
  const checkInType = useHostOnboarding((state) => state.listing.checkInType);
  const setCheckInType = useHostOnboarding((state) => state.setCheckInType);

  const checkIn = useHostOnboarding((state) => state.listing.checkIn);
  const checkOut = useHostOnboarding((state) => state.listing.checkOut);
  const setCheckIn = useHostOnboarding((state) => state.setCheckIn);
  const setCheckOut = useHostOnboarding((state) => state.setCheckOut);

  const handleRadioChange = (value: string) => {
    if (value === "self" || value === "host") {
      setOtherCheckInType(false);
      setCheckInType(value); // Set check-in type for other options
    } else {
      setOtherCheckInType(true);
      setCheckInType(""); // Clear check-in type when "Other" is selected
    }
  };

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Check-In</h3>
        <p
          className="text-sm underline transition duration-200 hover:cursor-pointer hover:text-muted-foreground"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Finish Editing" : "Edit"}
        </p>
      </div>

      <div className="flex flex-col gap-2 capitalize text-muted-foreground">
        {isEditing ? (
          <div>
            <RadioGroup
              defaultValue={otherCheckInType ? "other" : checkInType}
              onValueChange={handleRadioChange}
            >
              <div className="flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem value="self" id="self" />
                <Label htmlFor="self">
                  <h2 className="text-lg font-bold">Self check-in / out</h2>
                  <p className="text-muted-foreground">
                    Guests can check in and out by themselves
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3">
                <RadioGroupItem value="host" id="host" />
                <Label htmlFor="meet">
                  <h2 className="text-lg font-bold">Meet host at door</h2>
                  <p className="text-muted-foreground">
                    Guests get the keys from you when they arrive at the
                    property
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3">
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
        ) : (
          <p>{listing.checkInType}</p>
        )}
        {isEditing ? (
          <div className="flex justify-evenly">
            <div>
              <p className="font-semibold">Check-In</p>
              <Input
                type="time"
                placeholder="Check in time"
                className="p-5"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div>
              <p className="font-semibold">Check-Out</p>
              <Input
                type="time"
                placeholder="Check out time"
                className="p-5"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <p className="flex flex-row">
            Check in: {listing.checkIn} <Dot /> Check-out: {listing.checkOut}
          </p>
        )}
      </div>
    </div>
  );
}
