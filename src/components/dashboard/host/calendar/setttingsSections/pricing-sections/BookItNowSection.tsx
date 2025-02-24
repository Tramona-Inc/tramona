import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import React from "react";
import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { TRPCClientErrorLike } from "@trpc/client";
import { AppRouter } from "@/server/api/root";

export default function BookItNowSection({
  isBookItNowChecked: initialBookItNowChecked,
  propertyId,
}: {
  isBookItNowChecked: boolean;
  propertyId: number;
}) {
  const { currentHostTeamId } = useHostTeamStore();
  const utils = api.useContext();

  const [isTogglingBookItNow, setIsTogglingBookItNow] = React.useState(false);
  const [isUpdatingSlider, setIsUpdatingSlider] = React.useState(false);

  const { mutate: update } = api.properties.update.useMutation({
    onMutate: async (newData) => {
      // Track which type of update is happening
      const isToggleUpdate = "bookItNowEnabled" in newData.updatedProperty;
      if (isToggleUpdate) {
        setIsTogglingBookItNow(true);
      } else {
        setIsUpdatingSlider(true);
      }

      await utils.properties.getById.cancel({ id: propertyId });

      const previousProperty = utils.properties.getById.getData({
        id: propertyId,
      });

      if (previousProperty) {
        utils.properties.getById.setData(
          { id: propertyId },
          {
            ...previousProperty,
            ...newData.updatedProperty,
          },
        );
      }

      return { previousProperty, isToggleUpdate };
    },
    onError: (err, newData, context) => {
      utils.properties.getById.setData(
        { id: propertyId },
        context?.previousProperty,
      );

      if ("bookItNowEnabled" in newData.updatedProperty) {
        setLocalBookItNowChecked(!newData.updatedProperty.bookItNowEnabled);
      }
      if ("bookItNowHostDiscountPercentOffInput" in newData.updatedProperty) {
        setLocalSliderValue(previousValue);
        setIsError(true);
      }

      if ((err as TRPCClientErrorLike<AppRouter>).data?.code === "FORBIDDEN") {
        toast({
          title: "You do not have permission to change Co-host roles.",
          description: "Please contact your team owner to request access.",
        });
      } else {
        errorToast();
      }
    },
    onSuccess: (_, variables) => {
      if ("bookItNowHostDiscountPercentOffInput" in variables.updatedProperty) {
        setHasUserModifiedSlider(false);
        setIsError(false);
        toast({
          title: "Update Successful",
          description: "Book it now discount updated",
        });
      }
    },
    onSettled: (_, __, ___, context) => {
      // Reset appropriate loading state
      if (context?.isToggleUpdate) {
        setIsTogglingBookItNow(false);
      } else {
        setIsUpdatingSlider(false);
      }
      void utils.properties.getById.invalidate({ id: propertyId });
    },
  });

  const [previousValue, setPreviousValue] = React.useState(0);
  const [isError, setIsError] = React.useState(false);
  const [localBookItNowChecked, setLocalBookItNowChecked] = React.useState(
    initialBookItNowChecked,
  );
  const [localSliderValue, setLocalSliderValue] = React.useState(0);
  const [hasUserModifiedSlider, setHasUserModifiedSlider] =
    React.useState(false);

  // Query to get the initial book it now percent
  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    {
      onSuccess: (data) => {
        if (
          !hasUserModifiedSlider &&
          !isUpdatingSlider &&
          !isTogglingBookItNow
        ) {
          setLocalSliderValue(data.bookItNowHostDiscountPercentOffInput);
          setPreviousValue(data.bookItNowHostDiscountPercentOffInput);
        }
      },
    },
  );

  const handleBookItNowSwitch = (checked: boolean) => {
    setLocalBookItNowChecked(checked); // Optimistic update
    update({
      updatedProperty: {
        id: propertyId,
        bookItNowEnabled: checked,
      },
      currentHostTeamId: currentHostTeamId!,
    });

    // Reset slider if turning off
    if (!checked) {
      setHasUserModifiedSlider(false);
      setLocalSliderValue(property?.bookItNowHostDiscountPercentOffInput ?? 0);
    }
  };

  const handleSliderChange = (value: number) => {
    setLocalSliderValue(value);
    setHasUserModifiedSlider(true);
  };

  const handleBookItNowSliderLocal = () => {
    setPreviousValue(localSliderValue);
    update({
      updatedProperty: {
        id: propertyId,
        bookItNowHostDiscountPercentOffInput: localSliderValue,
      },
      currentHostTeamId: currentHostTeamId!,
    });
  };

  const hasChanges =
    localSliderValue !== property?.bookItNowHostDiscountPercentOffInput;

  return (
    <div className="space-y-1 rounded-lg border p-6">
      <div className="flex cursor-pointer items-center justify-between">
        <h3 className="text-xl font-bold text-black">Book it now</h3>
      </div>
      <div className="flex flex-row justify-between space-x-1">
        <p className="text-base text-muted-foreground">
          Turn on Book it now to allow guests to book your property instantly.
          All bookings automatically block off the dates on Tramona and Airbnb.
        </p>
        <Switch
          checked={localBookItNowChecked}
          disabled={isTogglingBookItNow}
          className="data-[state=checked]:bg-primaryGreen data-[state=unchecked]:bg-gray-300"
          onCheckedChange={handleBookItNowSwitch}
          style={{ cursor: isTogglingBookItNow ? "wait" : "pointer" }}
        />
      </div>

      {localBookItNowChecked && (
        <div className="space-y-4">
          <div className="my-6 w-full border-b border-gray-200" />
          <Label>{localSliderValue}% OFF</Label>
          <Slider
            value={[localSliderValue]}
            onValueChange={(value) => handleSliderChange(value[0]!)}
            max={80}
          />
          <p className="text-xs text-muted-foreground">
            Hosts that offer a discount on Tramona and keep pricing normal on
            Airbnb see the best results.
          </p>
          <div className="flex flex-col gap-2">
            {isError && (
              <p className="text-sm text-red-500">
                Failed to save changes. Please try again.
              </p>
            )}
            <div className="flex justify-end">
              <Button
                onClick={handleBookItNowSliderLocal}
                disabled={!hasChanges || isUpdatingSlider}
                variant={isError ? "destructive" : "primary"}
              >
                {isError
                  ? "Try Again"
                  : isUpdatingSlider
                    ? "Please wait..."
                    : hasChanges
                      ? "Save"
                      : "Saved"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
