// MonthCalendar.tsx
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/utils/utils";
import { AlertCircleIcon, Loader2Icon } from "lucide-react";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { Property } from "@/server/db/schema/tables/properties";

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type ReservationInfo = {
  start: string;
  end: string;
  platformBookedOn: "airbnb" | "tramona";
};

interface MonthCalendarProps {
  date: Date;
  reservedDateRanges?: ReservationInfo[];
  newBookedDates?: ReservationInfo[];
  onDateClick?: (date: Date) => void;
  selectedRange?: {
    start: Date | null;
    end: Date | null;
  };
  isEditing?: boolean;
  prices: Record<string, number | undefined>;
  isLoading?: boolean;
  isCalendarUpdating?: boolean;
  setHowYourCalendarWorksOpen?: (open: boolean) => void;
  hostProperties: Property[];
}

export default function MonthCalendar({
  date,
  reservedDateRanges = [],
  newBookedDates = [],
  prices,
  isLoading = false,
  isCalendarUpdating = false,
  setHowYourCalendarWorksOpen,
  hostProperties,
}: MonthCalendarProps) {
  console.log(prices);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
  }, []);

  // Set initial selected property when data loads
  useEffect(() => {
    if (hostProperties?.[0]) {
      setSelectedProperty(hostProperties[0]);
    }
  }, [hostProperties]);

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

  const isNewBookedDate = (date: Date): ReservationInfo | undefined => {
    const normalizedDate = normalizeToUTCMidnight(date);

    return newBookedDates.find((newBookedDate) => {
      const start = normalizeToUTCMidnight(new Date(newBookedDate.start));
      const end = normalizeToUTCMidnight(new Date(newBookedDate.end));

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

  const getBookItNowDiscount = useMemo(() => {
    return selectedProperty?.bookItNowEnabled &&
      selectedProperty.bookItNowHostDiscountPercentOffInput
      ? selectedProperty.bookItNowHostDiscountPercentOffInput
      : 0;
  }, [selectedProperty]);

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
            const newBookedInfo = currentDate
              ? isNewBookedDate(currentDate)
              : null;
            const isGrayedOut = currentDate ? isPastDate(currentDate) : false;

            let reservationClass = "";
            if (reservedInfo) {
              if (reservedInfo.platformBookedOn === "airbnb") {
                reservationClass = "bg-reserved-pattern";
              } else {
                reservationClass = "bg-reserved-pattern-2";
              }
            }
            if (newBookedInfo) {
              reservationClass = "bg-reserved-pattern-3";
            }
            const price =
              currentDate &&
              prices[currentDate.toISOString().split("T")[0] ?? ""];

            const discountedPrice = //we need to make sure that book it now it enabled too
              price && price * (1 - getBookItNowDiscount / 100);

            return (
              <div
                key={index}
                onClick={() => currentDate && !isGrayedOut}
                className={cn(
                  "relative flex flex-col items-center justify-center p-2 md:min-h-[100px]",
                  day && !isGrayedOut && "cursor-pointer",
                  reservationClass,
                  isGrayedOut && "cursor-not-allowed bg-gray-200 text-gray-400",
                  currentDate && !day && "bg-gray-50",
                  day &&
                    date.getFullYear() === currentDate?.getFullYear() &&
                    date.getMonth() === currentDate?.getMonth() &&
                    day === currentDate.getDate()
                    ? "font-semibold text-black"
                    : "text-muted-foreground",
                )}
              >
                <div className="flex items-center gap-x-1 absolute left-0 top-0 rounded-full bg-red-500 px-1 text-[0.6rem] text-white">
                  {/* If you comment this in, it will work only for unsynced properties */}
                  {newBookedInfo && (
                    <div
                      onClick={() => setHowYourCalendarWorksOpen?.(true)}
                      className="flex items-center gap-x-1 rounded-full bg-red-500 px-1 text-[0.6rem] text-white"
                    >
                      <div className="hidden md:block">Not Synced</div>
                      <AlertCircleIcon size={10} />
                    </div>
                  )}
                </div>{" "}
                {day && currentDate && (
                  <>
                    <span className="text-sm font-semibold">{day}</span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      {isCalendarUpdating ? (
                        <Loader2Icon
                          size={20}
                          className="mx-auto animate-spin text-accent"
                        />
                      ) : (
                        <>
                          {isLoading ? (
                            <Loader2Icon
                              size={20}
                              className="mx-auto animate-spin text-accent"
                            />
                          ) : (
                            (() => {
                              return price !== undefined && !isNaN(price!) ? (
                                <div className="flex flex-col items-center gap-1 text-xs md:flex-row md:text-base">
                                  {selectedProperty?.bookItNowEnabled &&
                                    getBookItNowDiscount > 0 && (
                                      <span className="text-xs text-gray-500 line-through">
                                        ${price?.toFixed(0)}
                                      </span>
                                    )}
                                  <span
                                    className={cn(
                                      "text-xs md:text-sm",
                                      selectedProperty?.bookItNowEnabled &&
                                        getBookItNowDiscount > 0
                                        ? "text-green-600"
                                        : "text-black",
                                    )}
                                  >
                                    $
                                    {discountedPrice?.toFixed(0) ??
                                      (price ? price.toFixed(0) : "")}
                                  </span>
                                </div>
                              ) : (
                                ""
                              );
                            })()
                          )}
                        </>
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
    <div className="relative mx-auto min-w-full max-w-4xl">{renderMonth()}</div>
  );
}
