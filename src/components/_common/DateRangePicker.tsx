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
import { api, type RouterOutputs } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { CalendarIcon } from "lucide-react";
import { type FieldPath, type FieldValues } from "react-hook-form";

type BlockedDates = RouterOutputs["properties"]["getBlockedDates"];

export default function DateRangePicker<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  propertyId,
  className,
  formLabel,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  propertyId?: number;
  className: string;
  formLabel: string;
}) {
  let disabledDays: Date[] | undefined;

  if (propertyId) {
    const { data } = api.properties.getBlockedDates.useQuery({ propertyId });
    disabledDays = data?.map((date: { date: string | number | Date; }) => new Date(date.date));
  }

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{formLabel}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={className}
                variant={field.value ? "filledInput" : "emptyInput"}
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
                disabled={disabledDays}
                // disabled={(date) => date < new Date()}
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
