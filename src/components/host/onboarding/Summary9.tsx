import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { options as cancellationPolicyOptions } from "./Onboarding10";
import { useState } from "react";
import { useHostOnboarding } from "@/utils/store/host-onboarding";

export default function Summary1() {
  const [isEditing, setIsEditing] = useState(false);

  const { listing } = useHostOnboarding((state) => state);

  const setCancellationPolicy = useHostOnboarding((state) => state.setCancellationPolicy);

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
            {cancellationPolicyOptions.map((item) => (
              <DropdownMenuItem
                key={item.title}
                onClick={() => setCancellationPolicy(item.id)}
                className="cursor-pointer p-1"
              >
                {item.id}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
