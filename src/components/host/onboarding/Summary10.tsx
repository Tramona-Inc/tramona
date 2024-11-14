import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { CANCELLATION_POLICIES } from "@/server/db/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Summary10() {
  const [isEditing, setIsEditing] = useState(false);

  const { listing } = useHostOnboarding((state) => state);

  const setBookItNowEnabled = useHostOnboarding(
    (state) => state.setBookItNowEnabled,
  );

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Book It Now</h3>
        <p
          className="text-sm underline transition duration-200 hover:cursor-pointer hover:text-muted-foreground"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Finish Editing" : "Edit"}
        </p>
      </div>
      {!isEditing && (
        <div className="flex flex-col gap-2 capitalize text-muted-foreground">
          <p>{listing.bookItNowEnabled ? "Enabled" : "Disabled"}</p>
        </div>
      )}
      {isEditing && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bookItNow"
            checked={listing.bookItNowEnabled}
            onCheckedChange={(checked) =>
              setBookItNowEnabled(checked as boolean)
            }
          />
          <Label
            htmlFor="bookItNow"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable &quot;Book It Now&quot;
          </Label>
        </div>
      )}
    </div>
  );
}
