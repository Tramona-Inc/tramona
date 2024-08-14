import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDateRange } from "@/utils/utils";
import { type InputVariant } from "../ui/input";
import { InputButton } from "../ui/input-button";
import { type DateRange } from "react-day-picker";
import { isSameDay } from "date-fns";
import { useState } from "react";

export default function DateRangeInput({
  className,
  label,
  placeholder = "Select dates",
  variant,
  icon,
  disablePast = false,
  disabledDays = [],
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
  disabledDays?: Date[];
  value?: DateRange;
  onChange: (value?: DateRange) => void;
}) {
  const [open, setOpen] = useState(false);

  function dateIsDisabled(date: Date) {
    if (date < new Date() && disablePast) return true;

    if (disabledDays.some((d) => isSameDay(date, d))) return true;

    // date is unreachable (there is a disabled day between it and the selected date)
    return disabledDays.some((d) => {
      if (value?.from === undefined) return false;
      return (value.from <= d && d <= date) || (date <= d && d <= value.from);
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <InputButton
          withClearBtn
          className={className}
          placeholder={placeholder}
          variant={variant}
          label={label}
          icon={icon}
          value={value?.from && formatDateRange(value.from, value.to)}
          setValue={onChange}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-auto rounded-3xl p-0 backdrop-blur-md"
        align="center"
        side="bottom"
      >
        <div className="hidden lg:block">
          <Calendar
            mode="range"
            selected={value}
            onSelect={(e) => {
              if (e?.from && e.to === undefined) {
                e.to = e.from;
              }
              onChange(e);
              if (e?.from !== e?.to) {
                setOpen(false);
              }
            }}
            disabled={dateIsDisabled}
            numberOfMonths={2}
            className="h-80"
          />
        </div>
        <div className="lg:hidden">
          <Calendar
            mode="range"
            selected={value}
            onSelect={(e) => {
              if (e?.from && e.to === undefined) {
                e.to = e.from;
              }
              onChange(e);
              if (e?.from !== e?.to) {
                setOpen(false);
              }
            }}
            disabled={dateIsDisabled}
            numberOfMonths={1}
            className="h-80"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
