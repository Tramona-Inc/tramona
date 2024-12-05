"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/utils";
import { Loader2Icon } from "lucide-react";

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type ReservationInfo = {
  start: string;
  end: string;
  platformBookedOn: "airbnb" | "tramona";
};

interface MonthCalendarProps {
  date: Date;
  reservedDateRanges?: ReservationInfo[];
  onDateClick?: (date: Date) => void;
  selectedRange?: {
    start: Date | null;
    end: Date | null;
  };
  isEditing?: boolean;
  prices: Record<string, number | undefined>;
  isLoading?: boolean;
}

export default function MonthCalendar({
  date,
  reservedDateRanges = [],
  // onDateClick,
  selectedRange,
  // isEditing = false,
  prices,
  isLoading = false,
}: MonthCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
  }, []);

  const normalizeToUTCMidnight = (d: Date) => {
    const normalized = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
    );
    return normalized;
  };

  const isDateReserved = (date: Date): ReservationInfo | undefined => {
    const normalizedDate = normalizeToUTCMidnight(date);

    return reservedDateRanges.find((reservedDate) => {
      const start = normalizeToUTCMidnight(new Date(reservedDate.start));
      const end = normalizeToUTCMidnight(new Date(reservedDate.end));

      return normalizedDate >= start && normalizedDate <= end;
    });
  };

  const isPastDate = (date: Date): boolean => {
    return date < new Date(currentDate.toISOString().split("T")[0]!);
  };

  const generateCalendarDays = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const renderMonth = () => {
    const monthDays = generateCalendarDays(date);

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 divide-x divide-y divide-gray-200 border border-gray-200">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="mb-1 p-2 text-center text-sm font-bold text-gray-500"
            >
              {day}
            </div>
          ))}
          {monthDays.map((day, index) => {
            const currentDate = day
              ? new Date(date.getFullYear(), date.getMonth(), day)
              : null;
            const reservedInfo = currentDate
              ? isDateReserved(currentDate)
              : null;

            const isGrayedOut = currentDate ? isPastDate(currentDate) : false;

            let reservationClass = "";
            if (reservedInfo) {
              if (reservedInfo.platformBookedOn === "airbnb") {
                reservationClass = "bg-reserved-pattern";
              } else if (reservedInfo.platformBookedOn === "tramona") {
                reservationClass = "bg-reserved-pattern-2";
              }
            }

            return (
              <div
                key={index}
                onClick={() =>
                  currentDate &&
                  !isGrayedOut
                }
                className={cn(
                  "flex min-h-[100px] flex-col items-center justify-center p-2",
                  day && !isGrayedOut && "cursor-pointer",
                  reservationClass,
                  isGrayedOut && "cursor-not-allowed bg-gray-200 text-gray-400",
                  currentDate &&
                    selectedRange?.start &&
                    (selectedRange.end
                      ? currentDate >= selectedRange.start &&
                        currentDate <= selectedRange.end
                      : currentDate.getTime() ===
                        selectedRange.start.getTime()) &&
                    "bg-blue-200",
                  !day && "bg-gray-50",
                  day &&
                    date.getFullYear() === currentDate?.getFullYear() &&
                    date.getMonth() === currentDate?.getMonth() &&
                    day === currentDate?.getDate()
                    ? "font-semibold text-black"
                    : "text-muted-foreground",
                )}
              >
                {day && currentDate && (
                  <>
                    <span className="text-sm font-medium">{day}</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {isLoading ? (
                        <Loader2Icon
                          size={20}
                          className="mx-auto animate-spin text-accent"
                        />
                      ) : (
                        (() => {
                          const price =
                            prices[
                              currentDate.toISOString().split("T")[0] ?? ""
                            ];
                          return price !== undefined && !isNaN(price)
                            ? `$${price}`
                            : "";
                        })()
                      )}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative">{renderMonth()}</div>
    </div>
  );
}