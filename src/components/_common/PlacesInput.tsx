import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/utils/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import usePlaceAutocomplete from "use-places-autocomplete";

import { type FieldPath, type FieldValues } from "react-hook-form";
import PlacesPopover from "./PlacesPopover";

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
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{formLabel}</FormLabel>
          <PlacesPopover
            autoFocus
            value={field.value}
            onValueChange={field.onChange}
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
