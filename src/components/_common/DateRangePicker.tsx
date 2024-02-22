import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateRange } from "@/utils/utils";
import { CalendarIcon } from "lucide-react";
import { type FieldPath, type FieldValues } from "react-hook-form";

export default function DateRangePicker<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props: Omit<
    React.ComponentProps<typeof FormField<TFieldValues, TName>>,
    "render"
  > & {
    className: string;
    formLabel: string;
  },
) {
  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem className={props.className}>
          <FormLabel>{props.formLabel}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={field.value ? "filledInput" : "emptyInput"}
                className="pl-3"
              >
                {field.value
                  ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    formatDateRange(field.value.from, field.value.to)
                  : "Select dates"}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 backdrop-blur-md"
              align="start"
              side="top"
            >
              <Calendar
                mode="range"
                selected={field.value}
                onSelect={(e) => {
                  if (e?.from && e.to === undefined) {
                    e.to = e.from;
                  }
                  field.onChange(e);
                }}
                disabled={(date) => date < new Date()}
                numberOfMonths={1}
                showOutsideDays={true}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
