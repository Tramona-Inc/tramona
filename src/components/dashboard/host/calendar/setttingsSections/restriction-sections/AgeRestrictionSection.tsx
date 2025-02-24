import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import CalendarSettingsDropdown from "../../components/CalendarSettingsDropdown";
import type { Property } from "@/server/db/schema";

type MutationContext = {
  previousProperty: Property | undefined;
};

export default function AgeRestrictionSection({
  ageRestriction,
  propertyId,
}: {
  ageRestriction: number | null;
  propertyId: number;
}) {
  const { currentHostTeamId } = useHostTeamStore();
  const utils = api.useContext();
  const [isRecovering, setIsRecovering] = useState(false);

  const { mutate: update } = api.properties.update.useMutation({
    onMutate: async (newData) => {
      setIsRecovering(false);
      await utils.properties.getById.cancel({ id: propertyId });

      const previousProperty = utils.properties.getById.getData({
        id: propertyId,
      });

      if (previousProperty) {
        utils.properties.getById.setData({ id: propertyId }, (old) =>
          old ? { ...old, ...newData.updatedProperty } : old,
        );
      }

      return { previousProperty } as MutationContext;
    },
    onError: (err, _newData, context: MutationContext | undefined) => {
      setIsRecovering(true);
      if (context?.previousProperty) {
        utils.properties.getById.setData({ id: propertyId }, (old) =>
          old ? { ...context.previousProperty, ...old } : old,
        );
      }
      setAge(context?.previousProperty?.ageRestriction ?? null);
      errorToast();
    },
    onSuccess: () => {
      toast({ title: "Property Updated!" });
    },
    onSettled: () => {
      setIsRecovering(false);
      void utils.properties.getById.invalidate({ id: propertyId });
    },
  });

  const [open, setOpen] = useState(false);
  const [age, setAge] = useState<number | null>(ageRestriction);

  const handleSave = () => {
    update({
      updatedProperty: { id: propertyId, ageRestriction: age },
      currentHostTeamId: currentHostTeamId!,
    });
  };

  return (
    <div className="rounded-lg border">
      <CalendarSettingsDropdown
        title="Age Restriction"
        description="Set the minimum age requirement for guests to make booking requests."
        open={open}
        setOpen={setOpen}
      />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="age" className="text-base font-semibold">
                Minimum age required to send request
              </Label>
              <p className="text-sm text-muted-foreground">
                Set the minimum age requirement for guests to make booking
                requests.
              </p>
              <Input
                id="age"
                type="number"
                value={age ?? ""}
                onChange={(e) =>
                  setAge(e.target.value ? Number(e.target.value) : null)
                }
                className="max-w-[120px]"
                min={0}
                max={100}
                placeholder="Enter age"
              />
            </div>
          </div>
          <Button
            onClick={handleSave}
            className="w-full"
            disabled={isRecovering}
          >
            {isRecovering ? "Recovering..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
