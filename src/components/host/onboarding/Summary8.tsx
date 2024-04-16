import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { useState } from "react";

export default function Summary8() {
  const [isEditing, setIsEditing] = useState(false);

  const { listing } = useHostOnboarding((state) => state);

  const petsAllowed = useHostOnboarding((state) => state.listing.petsAllowed);
  const setPetsAllowed = useHostOnboarding((state) => state.setPetsAllowed);

  const smokingAllowed = useHostOnboarding(
    (state) => state.listing.smokingAllowed,
  );
  const setSmokingAllowed = useHostOnboarding(
    (state) => state.setSmokingAllowed,
  );

  const otherHouseRules = useHostOnboarding(
    (state) => state.listing.otherHouseRules,
  );
  const setOtherHouseRules = useHostOnboarding(
    (state) => state.setOtherHouseRules,
  );

  return (
    <div className="flex flex-col gap-3 py-5">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">House Rules</h3>
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
        <p>
          Pets{" "}
          <span className="lowercase">
            {listing.petsAllowed ? "allowed" : "not allowed"}
          </span>
        </p>
        <p>
          Smoking{" "}
          <span className="lowercase">
            {listing.smokingAllowed ? "allowed" : "not allowed"}
          </span>
        </p>
        <h2 className="font-semibold text-primary">Other House Rules</h2>
        <p>{listing.otherHouseRules}</p>
      </div>
      {isEditing && (
        <>
          <p>Are pets allowed?</p>
          <RadioGroup
            className="flex flex-row gap-10"
            onValueChange={() => setPetsAllowed(!petsAllowed)}
            defaultValue={petsAllowed ? "true" : "false"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="allowed">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="allowed">No</Label>
            </div>
          </RadioGroup>
          <p>Is smoking allowed?</p>
          <RadioGroup
            className="flex flex-row gap-10"
            onValueChange={() => {
              setSmokingAllowed(!smokingAllowed);
            }}
            defaultValue={smokingAllowed ? "true" : "false"}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="allowed">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="allowed">No</Label>
            </div>
          </RadioGroup>
          <Textarea
            value={otherHouseRules ?? undefined}
            onChange={(e) => setOtherHouseRules(e.target.value)}
          />
        </>
      )}
    </div>
  );
}
