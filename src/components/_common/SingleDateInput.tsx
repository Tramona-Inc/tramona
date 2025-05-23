import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type InputVariant } from "../ui/input";
import { InputButton } from "../ui/input-button";
import { isSameDay, format, isBefore, isAfter } from "date-fns";
import { useState } from "react";

export default function SingleDateInput({
  className,
  label,
  placeholder = "Select date",
  variant,
  icon,
  disablePast = false,
  disabledDays = [],
  value,
  onChange,
  minDate,
  maxDate,
  popoverSide = "bottom",
  withClearBtn = true,
}: {
  className?: string;
  label?: string;
  placeholder?: string;
  variant?: InputVariant;
  icon?: React.FC<{ className?: string }>;
  disablePast?: boolean;
  disabledDays?: Date[];
  value?: Date;
  onChange: (value?: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  popoverSide?: "top" | "right" | "bottom" | "left";
  withClearBtn?: boolean;
}) {
  const [open, setOpen] = useState(false);

  function dateIsDisabled(date: Date) {
    if (date < new Date() && disablePast) return true;
    if (minDate && isBefore(date, minDate)) return true;
    if (maxDate && isAfter(date, maxDate)) return true;
    return disabledDays.some((d) => isSameDay(date, d));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className="flex h-full items-center justify-center p-0"
      >
        <InputButton
          className={className}
          placeholder={placeholder}
          variant={variant}
          label={label}
          icon={icon}
          value={value ? format(value, "MMM d, yyyy") : undefined}
          setValue={() => onChange(undefined)}
          withClearBtn={!!value}
        />
      </PopoverTrigger>
      <PopoverContent
        className="z-0 w-auto rounded-2xl border border-gray-200 bg-white p-3 shadow-lg backdrop-blur-md"
        align="center"
        side={popoverSide}
        avoidCollisions={false}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          disabled={dateIsDisabled}
          className="h-72"
          fromDate={minDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
