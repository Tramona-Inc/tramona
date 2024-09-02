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

export default function Summary1() {
  const [isEditing, setIsEditing] = useState(false);

  const { listing } = useHostOnboarding((state) => state);

  const setCancellationPolicy = useHostOnboarding(
    (state) => state.setCancellationPolicy,
  );

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Cancellation Policy</h3>
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
        <p>{listing.cancellationPolicy}</p>
      </div>
      {isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Edit your cancellation policy</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            {CANCELLATION_POLICIES.map((policy) => (
              <DropdownMenuItem
                key={policy}
                onClick={() => setCancellationPolicy(policy)}
                className="cursor-pointer p-1"
              >
                {policy}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
