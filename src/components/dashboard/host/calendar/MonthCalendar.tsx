"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/utils";

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
}

export default function MonthCalendar({
  date,
  reservedDateRanges = [],
  onDateClick,
  selectedRange,
  isEditing = false,
  prices,
}: MonthCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
  }, []);

  const isDateReserved = (date: Date): ReservationInfo | undefined => {
    return reservedDateRanges.find((reservedDate) => {
      return date.toISOString().split("T")[0] === reservedDate.start;
    });
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

            let reservationClass = "";
            if (reservedInfo) {
              console.log("reservedInfo", reservedInfo);
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
                  currentDate && isEditing && onDateClick?.(currentDate)
                }
                className={cn(
                  "flex min-h-[100px] flex-col items-center justify-center p-2",
                  day && isEditing && "cursor-pointer",
                  reservationClass,
                  currentDate &&
                    selectedRange?.start &&
                    (selectedRange.end
                      ? currentDate >= selectedRange.start &&
                        currentDate <= selectedRange.end
                      : currentDate.getTime() ===
                        selectedRange.start.getTime()) &&
                    "bg-blue-200",
                  !day && "bg-gray-50", // Style for empty cells
                  day &&
                    date.getFullYear() === currentDate?.getFullYear() &&
                    date.getMonth() === currentDate?.getMonth() &&
                    day === currentDate?.getDate()
                    ? "font-semibold text-black"
                    : "text-muted-foreground",
                )}
              >
                {day && (
                  <>
                    <span className="text-sm font-medium">{day}</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      $
                      {prices[currentDate.toISOString().split("T")[0] ?? ""] ??
                        168}
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
