import { FormField, FormItem, FormMessage } from "../ui/form";

import { type FieldPath, type FieldValues } from "react-hook-form";
import PlacesPopover from "./PlacesPopover";
import { useState } from "react";
import { type InputVariant } from "../ui/input";
import { InputButton } from "../ui/input-button";
import { cn } from "@/utils/utils";
import { api } from "@/utils/api";

export default function PlacesInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  formLabel,
  placeholder,
  variant,
  icon,
  setInitialLocation,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className?: string;
  formLabel: string;
  placeholder?: string;
  variant?: InputVariant;
  icon?: React.FC<{ className?: string }>;
  setInitialLocation: (location: { lat: number; lng: number }) => void;
  }) {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={cn("relative", className)}>
          <PlacesPopover
            open={open}
            setOpen={setOpen}
            value={field.value}
            onValueChange={async (location) => {
              field.onChange(location);
              if (location) {
                const { coordinates } = await utils.offers.getCoordinates.fetch(
                  {
                    location,
                  },
                );

                const { lat, lng } = coordinates.location!;
                setInitialLocation({lat: lat, lng: lng});
              }
            }}
            className="w-96 -translate-y-11 overflow-clip px-0 pt-0"
            trigger={({ value, disabled }) => (
              <InputButton
                withClearBtn
                variant={variant}
                label={formLabel}
                placeholder={placeholder}
                value={value}
                setValue={field.onChange}
                type="button"
                role="combobox"
                disabled={disabled}
                icon={icon}
                className="bg-white"
              >
                {value ? value : "Select a location"}
              </InputButton>
            )}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
