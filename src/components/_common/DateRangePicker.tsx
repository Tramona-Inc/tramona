import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { isSameDay } from "date-fns";
import { type DateRange } from "react-day-picker";
import { type InputVariant } from "../ui/input";
import { InputButton } from "../ui/input-button";

export default function DateRangePicker({
  propertyId,
  className,
  label,
  placeholder = "Select dates",
  variant,
  icon,
  disablePast = false,
  value,
  onChange,
}: {
  propertyId?: number;
  className?: string;
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  icon?: React.FC<{ className?: string }>;
  disablePast?: boolean;
  value?: DateRange;
  onChange: (value?: DateRange) => void;
}) {
  const { data, refetch } = api.properties.getBlockedDates.useQuery(
    { propertyId: propertyId ?? 0 },
    { enabled: false },
  );

  const disabledDays: Date[] | undefined = data?.map(
    (date) => new Date(date.date),
  );

  function dateIsDisabled(date: Date) {
    if (date < new Date() && disablePast) return true;

    if (disabledDays?.some((d) => isSameDay(date, d))) return true;

    // date is unreachable (there is a disabled day between it and the selected date)
    return disabledDays?.some((d) => {
      if (value?.from === undefined) return false;
      return (value.from <= d && d <= date) || (date <= d && d <= value.from);
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputButton
          onClick={() => refetch()}
          className={className}
          placeholder={placeholder}
          variant={variant}
          label={label}
          icon={icon}
          value={value?.from && formatDateRange(value.from, value.to)}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 backdrop-blur-md"
        align="start"
        side="top"
      >
        <Calendar
          mode="range"
          selected={value}
          onSelect={(e) => {
            if (e?.from && e.to === undefined) {
              e.to = e.from;
            }
            onChange(e);
          }}
          disabled={(date: Date) => !!dateIsDisabled(date)}
          numberOfMonths={1}
          showOutsideDays={true}
        />
      </PopoverContent>
    </Popover>
  );
}
