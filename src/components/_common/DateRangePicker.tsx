import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { isSameDay } from "date-fns";
import { useState } from "react";
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
  alreadyBid,
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
  alreadyBid: boolean;
}) {
  const { data: dates, refetch: refetchBidDates } =
    api.biddings.getDatesFromBid.useQuery(
      { propertyId: propertyId ?? 0 },
      {
        enabled: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const { data, refetch: refetchBlockedDates } =
    api.properties.getBlockedDates.useQuery(
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

  const [error, setError] = useState<string | null>(null);

  const handleSelect = (e: DateRange | undefined) => {
    if (e?.from && e.to === undefined) {
      e.to = e.from;
    }

    console.log(dates);
    console.log({ checkIn: e?.from, checkOut: e?.to });

    // Check for exact match of bid dates only if both from and to dates are selected
    if (e?.from && e?.to) {
      const hasExactMatch = (dates ?? []).some(
        (bid) =>
          e.to &&
          e.from &&
          isSameDay(e.from, new Date(bid.checkIn)) &&
          isSameDay(e.to, new Date(bid.checkOut)),
      );

      console.log(hasExactMatch);

      if (hasExactMatch) {
        setError("Already bid dates");
        return;
      }
    }

    setError(null); // Clear error if no exact match
    onChange(e);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputButton
          onClick={() => {
            void refetchBlockedDates();
            if (alreadyBid) {
              void refetchBidDates();
            }
          }}
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
        <div className="flex flex-col items-center">
          {error && <div className="mt-2 text-red-500">{error}</div>}
        </div>
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          disabled={(date: Date) => !!dateIsDisabled(date)}
          numberOfMonths={1}
          showOutsideDays={true}
        />
      </PopoverContent>
    </Popover>
  );
}
