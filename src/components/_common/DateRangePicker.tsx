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

  // Flatten the array of unique dates from the bid dates
  const uniqueDates = Array.from(
    new Set(
      (dates ?? []).flatMap((date) => [
        new Date(date.checkIn).toISOString().split("T")[0],
        new Date(date.checkOut).toISOString().split("T")[0],
      ]),
    ),
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

    // Check for exact match of bid dates only if both from and to dates are selected
    if (e?.from && e?.to) {
      const fromDateStr = e.from.toISOString().split("T")[0];
      const toDateStr = e.to.toISOString().split("T")[0];

      const hasExactMatch =
        uniqueDates.includes(fromDateStr) && uniqueDates.includes(toDateStr);

      if (hasExactMatch) {
        setError("Selected dates overlap exactly with an existing bid.");
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
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          disabled={(date: Date) => !!dateIsDisabled(date)}
          numberOfMonths={1}
          showOutsideDays={true}
        />
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </PopoverContent>
    </Popover>
  );
}
