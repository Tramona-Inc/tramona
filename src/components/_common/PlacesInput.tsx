import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";

import { type FieldPath, type FieldValues } from "react-hook-form";
import PlacesPopover from "./PlacesPopover";
import { useState } from "react";

export default function PlacesInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  className,
  formLabel,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  className: string;
  formLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{formLabel}</FormLabel>
          <PlacesPopover
            autoFocus
            open={open}
            setOpen={setOpen}
            value={field.value}
            onValueChange={field.onChange}
            className="w-[100vw] -translate-y-12 overflow-clip px-0 pt-0 sm:w-72 sm:-translate-x-5"
            trigger={({ value, disabled }) => (
              <Button
                variant={value ? "filledInput" : "emptyInput"}
                type="button"
                role="combobox"
                disabled={disabled}
                className="line-clamp-1 text-ellipsis text-left"
              >
                {value ? value : "Select a location"}
              </Button>
            )}
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
