import { Calendar } from "@/components/ui/calendar";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { type FieldPath, type FieldValues } from "react-hook-form";
import { type InputVariant } from "../ui/input";
import { InputButton } from "../ui/input-button";

export default function DateRangePicker<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  propertyId,
  className,
  formLabel,
  variant,
  icon,
  ...props
}: Omit<
  React.ComponentProps<typeof FormField<TFieldValues, TName>>,
  "render"
> & {
  propertyId?: number;
  className?: string;
  formLabel?: string;
  variant?: InputVariant;
  icon?: React.FC<{ className?: string }>;
}) {
  const { data, refetch } = api.properties.getBlockedDates.useQuery(
    { propertyId: propertyId ?? 0 },
    { enabled: false },
  );

  const disabledDays = data?.map((date) => new Date(date.date));

  return (
    <FormField
      {...props}
      render={({ field }) => (
        <FormItem>
          <Popover>
            <PopoverTrigger asChild>
              <InputButton
                onClick={() => propertyId && refetch()}
                className={className}
                placeholder="Select dates"
                variant={variant}
                label={formLabel}
                icon={icon}
                value={
                  field.value &&
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  formatDateRange(field.value.from, field.value.to)
                }
              />
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
                disabled={(date) =>
                  (disabledDays ?? []).some(
                    (d) => date.toDateString() === d.toDateString(),
                  ) || date < new Date()
                }
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
