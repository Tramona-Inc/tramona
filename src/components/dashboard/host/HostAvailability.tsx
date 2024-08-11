import { type Property } from "@/server/db/schema/tables/properties";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { useCallback, useEffect, useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import { api } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { daysOfWeek, months } from "@/utils/constants";

type ReservationInfo = {
  start: string;
  end: string;
  platformBookedOn: string | null;
};

export default function HostAvailability({ property }: { property: Property }) {
  const [editing, setEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // actual current date
  const [calendarDate, setCalendarDate] = useState<Date>(new Date()); // date displayed on the calendar
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [pendingChanges, setPendingChanges] = useState<
    { start: Date; end: Date; isBlocking: boolean }[]
  >([]);

  const { mutateAsync: syncCalendar } = api.calendar.syncCalendar.useMutation();
  const { mutateAsync: updateCalendar } =
    api.calendar.updateCalendar.useMutation();
  const {
    data: reservedDateRanges,
    isLoading,
    refetch,
  } = api.calendar.getReservedDateRanges.useQuery({ propertyId: property.id });

  const fetchReservedDateRanges = useCallback(async () => {
    try {
      if (!property.iCalLink) {
        console.log("No iCalLink for this property");
        return;
      }
      // Refresh iCal data
      await syncCalendar({
        iCalLink: property.iCalLink,
        propertyId: property.id,
        platformBookedOn: "airbnb",
      });
      console.log("Refreshed iCal data");

      // Refetch reserved date ranges
      await refetch();
    } catch (error) {
      console.error("Error fetching reserved dates:", error);
    }
  }, [property.iCalLink, property.id, syncCalendar, refetch]);

  useEffect(() => {
    const today = new Date();
    console.log(today.toString());
    setCurrentDate(today);
    setCalendarDate(today);
    void fetchReservedDateRanges();
  }, [fetchReservedDateRanges]);

  useEffect(() => {
    if (!editing) {
      setSelectedRange({ start: null, end: null });
      setPendingChanges([]);
    }
  }, [editing]);

  const isDateReserved = (date: Date): ReservationInfo | undefined => {
    return reservedDateRanges?.find((reservedDate) => {
      const start = new Date(reservedDate.start);
      const end = new Date(reservedDate.end);
      return date >= start && date < end;
    });
  };

  const handleDateClick = (date: Date) => {
    if (!editing) return;

    const clickedReservation = isDateReserved(date);

    if (
      clickedReservation &&
      clickedReservation.platformBookedOn === "tramona"
    ) {
      // If clicking on a Tramona-reserved date, select the entire range
      setSelectedRange({
        start: new Date(clickedReservation.start),
        end: new Date(clickedReservation.end),
      });
    } else {
      setSelectedRange((prev) => {
        if (!prev.start && !prev.end) {
          return { start: date, end: date };
        } else if (prev.start && prev.end) {
          if (date < prev.start) {
            return { ...prev, start: date };
          } else if (date > prev.end) {
            return { ...prev, end: date };
          } else if (
            date.getTime() === prev.start.getTime() &&
            date.getTime() === prev.end.getTime()
          ) {
            return { start: null, end: null };
          } else {
            return { start: date, end: date };
          }
        } else {
          return { start: date, end: date };
        }
      });
    }
  };

  const handleRangeSubmit = (isBlocking: boolean) => {
    if (!editing || !selectedRange.start || !selectedRange.end) return;

    setPendingChanges((prev) => [
      ...prev,
      {
        start: new Date(selectedRange.start!.setHours(0, 0, 0, 0)),
        end: new Date(selectedRange.end!.setHours(23, 59, 59, 999)),
        isBlocking,
      },
    ]);
    setSelectedRange({ start: null, end: null });
  };

  const handleEditingDone = async () => {
    try {
      for (const range of pendingChanges) {
        await updateCalendar({
          propertyId: property.id,
          start: range.start.toISOString(),
          end: range.end.toISOString(),
          isAvailable: !range.isBlocking,
          platformBookedOn: "tramona",
        });
      }
      setPendingChanges([]);
      await refetch();
    } catch (error) {
      console.error("Error updating calendar:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const generateCalendarDays = (month: number): (number | null)[] => {
    const year = calendarDate.getFullYear();
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

  const renderMonth = (monthOffset: number) => {
    const monthDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + monthOffset,
      1,
    );
    const monthDays = generateCalendarDays(monthDate.getMonth());

    if (isLoading) {
      return <Spinner />;
    }

    return (
      <div className="w-full sm:w-1/2">
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="mb-1 text-center text-sm font-bold text-gray-500"
            >
              {day.toUpperCase()}
            </div>
          ))}
          {monthDays.map((day, index) => {
            const date = day
              ? new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
              : null;
            const reservedInfo = date ? isDateReserved(date) : null;

            const isPendingBlock =
              date &&
              pendingChanges.some(
                (range) =>
                  date >= range.start && date <= range.end && range.isBlocking,
              );
            const isPendingUnblock =
              date &&
              pendingChanges.some(
                (range) =>
                  date >= range.start && date <= range.end && !range.isBlocking,
              );
            const isSelected =
              date &&
              selectedRange.start &&
              (selectedRange.end
                ? date >= selectedRange.start && date <= selectedRange.end
                : date.getTime() === selectedRange.start.getTime());
            let reservationClass = "";
            if (reservedInfo) {
              if (
                reservedInfo.platformBookedOn === "airbnb") {
                reservationClass = "bg-reserved-pattern";
              } else if (reservedInfo.platformBookedOn === "tramona") {
                reservationClass = "bg-reserved-pattern-2";
              }
            }
            return (
              <div
                key={index}
                onClick={() => date && handleDateClick(date)}
                className={`flex h-12 flex-1 items-center justify-center font-semibold ${day && editing ? "cursor-pointer" : ""} ${reservationClass} ${isPendingBlock ? "bg-yellow-200" : ""} ${isPendingUnblock ? "bg-green-200" : ""} ${isSelected ? "bg-blue-200" : ""} ${
                  day &&
                  monthDate.getFullYear() === currentDate.getFullYear() &&
                  monthDate.getMonth() === currentDate.getMonth() &&
                  day === currentDate.getDate()
                    ? "font-semibold text-blue-600"
                    : "text-muted-foreground"
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const goToPreviousMonth = () => {
    setCalendarDate(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCalendarDate(
      (prevDate) =>
        new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1),
    );
  };

  return (
    <div className="mb-16 mt-6 space-y-10">
      <div className="text-end">
        <HostPropertyEditBtn
          editing={editing}
          setEditing={setEditing}
          property={property}
          onSubmit={handleEditingDone}
        />
      </div>
      <div className="mx-auto max-w-4xl">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="relative basis-full text-center sm:basis-1/2">
              <button
                onClick={goToPreviousMonth}
                className="absolute left-0 top-0 mr-2 rounded border border-gray-300 p-2 text-gray-400 transition-colors duration-150 hover:text-gray-600"
              >
                <MoveLeft className="h-4 w-4" />
              </button>
              <h3 className="text-xl font-bold text-gray-800">
                {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
              </h3>
              <button
                onClick={goToNextMonth}
                className="absolute right-0 top-0 ml-2 rounded border border-gray-300 p-2 text-gray-400 transition-colors duration-150 hover:text-gray-600 sm:hidden"
              >
                <MoveRight className="h-4 w-4" />
              </button>
            </div>
            <div className="relative hidden basis-1/2 text-center sm:block">
              <h3 className="text-xl font-bold text-gray-800">
                {months[(calendarDate.getMonth() + 1) % 12]}{" "}
                {calendarDate.getMonth() === 11
                  ? calendarDate.getFullYear() + 1
                  : calendarDate.getFullYear()}
              </h3>
              <button
                onClick={goToNextMonth}
                className="absolute right-0 top-0 ml-2 rounded border border-gray-300 p-2 text-gray-400 transition-colors duration-150 hover:text-gray-600"
              >
                <MoveRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="hidden gap-12 sm:flex">
            {renderMonth(0)}
            {renderMonth(1)}
          </div>
          <div className="sm:hidden">{renderMonth(0)}</div>
          {editing && selectedRange.start && selectedRange.end && (
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleRangeSubmit(true)}
                className="rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                Block Selected Range
              </button>
              <button
                onClick={() => handleRangeSubmit(false)}
                className="rounded bg-green-500 p-2 text-white hover:bg-green-600"
              >
                Unblock Selected Range
              </button>
            </div>
          )}
          <div className="mt-12 flex flex-col space-y-2 text-sm">
            <div className="flex items-center">
              <div className="mr-2 h-6 w-6 bg-zinc-50"></div>
              <span className="text-muted-foreground">Vacant</span>
            </div>
            <Tooltip>
              <div className="flex items-center">
                <div
                  className="mr-2 h-6 w-6 bg-zinc-200"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, red, red 1px, transparent 1px, transparent 4px)",
                  }}
                ></div>
                <TooltipTrigger>
                  <span className="text-muted-foreground">
                    Blocked on Airbnb
                  </span>
                </TooltipTrigger>
              </div>
              <TooltipContent className="" side="bottom">
                Dates blocked on Airbnb's calendar can only be unblocked on
                Airbnb
              </TooltipContent>
            </Tooltip>
            <div className="flex items-center">
              <div className="bg-reserved-pattern-2 mr-2 h-6 w-6"></div>
              <span className="text-muted-foreground">Blocked on Tramona</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
