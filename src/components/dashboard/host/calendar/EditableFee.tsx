import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Property } from "@/server/db/schema/tables/properties";
import type { ExtraPricingField } from "./pricingfields";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { api } from "@/utils/api";
import { TRPCClientErrorLike } from "@trpc/client";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { AppRouter } from "@/server/api/root";
import { useState, useMemo, useEffect } from "react";

interface EditableFeeProps {
  property: Property;
  field: ExtraPricingField;
  title?: string;
  subtitle: string;
  learnMoreLink?: string;
  helpText?: string;
  showGuestCounter?: boolean;
}

type MutationContext = {
  previousProperty: Property | undefined;
};

export default function EditableFee({
  property,
  field,
  title,
  subtitle,
  helpText,
  learnMoreLink,
  showGuestCounter = false,
}: EditableFeeProps) {
  const { currentHostTeamId } = useHostTeamStore();
  const utils = api.useContext();

  const { mutate: update, isLoading: isUpdating } =
    api.properties.update.useMutation({
      onMutate: async (newData) => {
        await utils.properties.getById.cancel({ id: property.id });

        const previousProperty = utils.properties.getById.getData({
          id: property.id,
        });

        if (previousProperty) {
          utils.properties.getById.setData({ id: property.id }, (old) =>
            old ? { ...old, ...newData.updatedProperty } : old,
          );
        }

        return { previousProperty } as MutationContext;
      },
      onError: (err, _newData, context: MutationContext | undefined) => {
        if (context?.previousProperty) {
          utils.properties.getById.setData({ id: property.id }, (old) =>
            old ? { ...context.previousProperty, ...old } : old,
          );
        }
        setEditValue(String(initialValue / 100));
        if (showGuestCounter) {
          setEditGuestCount(
            property.maxGuestsWithoutFee ?? property.maxNumGuests,
          );
        }

        if (
          (err as TRPCClientErrorLike<AppRouter>).data?.code === "FORBIDDEN"
        ) {
          toast({
            title: "You do not have permission to change Co-host roles.",
            description: "Please contact your team owner to request access.",
          });
        } else {
          errorToast();
        }
      },
      onSuccess: () => {
        toast({
          title: "Update Successful",
        });
        setIsEditing(false);
      },
      onSettled: () => {
        void utils.properties.getById.invalidate({ id: property.id });
      },
    });

  const [isEditing, setIsEditing] = useState(false);
  const initialValue = useMemo(() => property[field], [property, field]);
  const [editValue, setEditValue] = useState(String(initialValue / 100));
  const [editGuestCount, setEditGuestCount] = useState<number>(
    property.maxGuestsWithoutFee ?? property.maxNumGuests,
  );

  useEffect(() => {
    setEditValue(String(initialValue / 100));
  }, [initialValue]);

  const handleSave = () => {
    const parsedValue = parseFloat(editValue);
    if (isNaN(parsedValue)) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid number.",
      });
      return;
    }

    update({
      updatedProperty: {
        id: property.id,
        [field]: parsedValue * 100,
        ...(showGuestCounter && {
          maxGuestsWithoutFee: editGuestCount,
        }),
      },
      currentHostTeamId: currentHostTeamId!,
    });
  };

  const handleCancel = () => {
    setEditValue(String(initialValue / 100));
    setEditGuestCount(property.maxGuestsWithoutFee ?? property.maxNumGuests);
    setIsEditing(false);
  };

  const handleEditValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setEditValue(value);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
          <p className="text-lg text-muted-foreground">{subtitle}</p>

          <div className="flex items-center gap-2">
            <span className="text-4xl font-semibold">$</span>
            <Input
              type="text"
              value={editValue}
              onChange={handleEditValueChange}
              className="h-16 w-32 text-4xl font-semibold"
            />
          </div>

          {showGuestCounter && (
            <Card className="mt-4 p-4">
              <div className="flex items-center justify-between">
                <span>For each guest after</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setEditGuestCount(Math.max(1, editGuestCount - 1))
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-4 text-center">{editGuestCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditGuestCount(editGuestCount + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {helpText && (
          <p className="text-muted-foreground">
            {helpText}
            {learnMoreLink && (
              <Button variant="link" className="h-auto px-1.5">
                Learn more
              </Button>
            )}
          </p>
        )}

        <div className="space-y-2">
          <Button className="w-full" onClick={handleSave}>
            {isUpdating ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card
      className="cursor-pointer p-6 transition-colors hover:bg-accent/50"
      onClick={() => setIsEditing(true)}
    >
      <div className="space-y-6">
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
        <div>
          <div className="mb-2 text-sm">{subtitle}</div>
          <div className="text-4xl font-semibold">
            ${parseFloat(editValue).toFixed(2)}
          </div>
        </div>
        {helpText && (
          <p className="text-sm text-muted-foreground">
            {helpText}
            {learnMoreLink && (
              <Button variant="link" className="h-auto px-1.5 text-sm">
                Learn more
              </Button>
            )}
          </p>
        )}
      </div>
    </Card>
  );
}
