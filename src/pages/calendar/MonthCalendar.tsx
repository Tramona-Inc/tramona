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
}: MonthCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
  }, []);

  const isDateReserved = (date: Date): ReservationInfo | undefined => {
    return reservedDateRanges.find((reservedDate) => {
      const start = new Date(reservedDate.start);
      const end = new Date(reservedDate.end);
      return date >= start && date < end;
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
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="mb-1 text-center text-sm font-bold text-gray-500"
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
                  "flex h-14 flex-1 items-center justify-center font-semibold sm:h-20",
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
                  day &&
                    date.getFullYear() === currentDate.getFullYear() &&
                    date.getMonth() === currentDate.getMonth() &&
                    day === currentDate.getDate()
                    ? "font-semibold text-black"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex flex-col items-center">
                  <span>{day}</span>
                  {day && <span className="text-xs">$168</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative">
        {renderMonth()}

        {/* Legend */}
        <div className="mt-12 flex flex-col space-y-2 text-sm">
          <div className="flex items-center">
            <div className="mr-2 h-6 w-6 bg-zinc-50"></div>
            <span className="text-muted-foreground">Vacant</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-6 w-6 bg-reserved-pattern"></div>
            <span className="text-muted-foreground">Blocked on Airbnb</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-6 w-6 bg-reserved-pattern-2"></div>
            <span className="text-muted-foreground">Blocked on Tramona</span>
          </div>
        </div>
      </div>
    </div>
  );
}
