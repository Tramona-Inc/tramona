import React, { useMemo, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import MonthCalendar from "./MonthCalendar";
import CalendarSettings from "./CalendarSettings";
import { useState } from "react";
import { Property } from "@/server/db/schema/tables/properties";
import { eachDayOfInterval, format, isBefore, parseISO } from "date-fns";

export default function CalendarComponent() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );
  const { data: hostProperties, isLoading: loadingProperties } =
    api.properties.getHostProperties.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  // Set initial selected property when data loads
  useEffect(() => {
    setSelectedProperty(hostProperties?.[0] ?? null);
  }, [hostProperties]);

  // const [editing, setEditing] = useState(false);
  // const [selectedRange, setSelectedRange] = useState<{
  //   start: Date | null;
  //   end: Date | null;
  // }>({ start: null, end: null });

  const queryInput = useMemo(() => {
    if (!selectedProperty?.hospitableListingId) return null; // Early return
    return {
      hospitableListingId: selectedProperty.hospitableListingId,
    };
  }, [selectedProperty?.hospitableListingId]);

  const { data: hospitableCalendarPrices, isLoading: loadingPrices } =
    api.calendar.getAndUpdateHostCalendar.useQuery(queryInput!, {
      enabled: Boolean(queryInput),
    });

  const prices = useMemo(() => {
    const priceMap: Record<string, number | undefined> = {};
    const daysInMonth = eachDayOfInterval({
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });

    daysInMonth.forEach((currentDate) => {
      const dateString = currentDate.toISOString().split("T")[0]!;
      const priceEvent = hospitableCalendarPrices?.find(
        (event) => event.date === dateString,
      );
      if (dateString) {
        priceMap[dateString] = priceEvent?.price.amount
          ? priceEvent.price.amount / 100
          : undefined;
      }
    });

    return priceMap;
  }, [date, hospitableCalendarPrices]);

  const reservedDates = hospitableCalendarPrices
    ?.filter((price) => price.availability.available === false)
    .map((price) => ({
      start: price.date,
      end: price.date,
      platformBookedOn: "airbnb" as const,
    }));

  // const handleDateClick = (date: Date) => {
  //   if (!editing) return;

  //   setSelectedRange((prev) => {
  //     if (!prev.start || (prev.start && prev.end)) {
  //       // Start a new range
  //       return { start: date, end: null };
  //     }
  //     if (!prev.end) {
  //       // Set the end date if it’s not already set
  //       if (date >= prev.start) {
  //         return { ...prev, end: date };
  //       } else {
  //         // If clicked date is before the start date, reverse the range
  //         return { start: date, end: prev.start };
  //       }
  //     }
  //     // Default fallback (shouldn't normally hit this point)
  //     return { start: date, end: null };
  //   });
  // };


  const isDateReserved = useCallback((date: string) => {
    const parsedDate = parseISO(date);

    const normalizedDate = format(parsedDate, "yyyy-MM-dd");

    if (isBefore(parsedDate, new Date())) {
      return true;
    }

    if (
      reservedDates?.some(
        (reservedDate) =>
          reservedDate.start <= normalizedDate &&
          reservedDate.end >= normalizedDate,
      )
    ) {
      return true;
    }

      return false;
    },
    [reservedDates],
  );

  const totalVacancies = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return eachDayOfInterval({ start: startOfMonth, end: endOfMonth }).filter(
      (day) => isBefore(today, day) && !isDateReserved(day.toISOString()),
    ).length;
  }, [date, isDateReserved]);

  const leftOnTheTable = useMemo(() => {
    return Object.entries(prices || {})
      .filter(([dateStr]) => !isDateReserved(dateStr))
      .reduce((sum, [_, price]) => (price ? sum + price : sum), 0);
  }, [reservedDates, prices]);

  const changeMonth = (increment: number) => {
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth() + increment,
      1,
    );
    setDate(newDate);
  };

  const isLoading = loadingProperties || loadingPrices;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-4 p-2 sm:p-4 lg:flex-row">
      {/* CALENDAR */}
      <Card className="h-full w-full max-w-[1050px] flex-shrink-0">
        <CardContent className="flex h-full flex-col p-3 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            {/* Left Side: Month/Year and Stats */}
            <div>
              <h2 className="mb-2 text-xl font-bold sm:text-2xl">
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="text-xs font-medium sm:text-sm">
                <p className="py-1">
                  {isLoading
                    ? "Loading vacancies..."
                    : `${totalVacancies} vacancies this month`}
                </p>
                <p>
                  {isLoading
                    ? "Loading money left on table..."
                    : `$${leftOnTheTable.toFixed(2)} left on the table`}
                </p>
              </div>
            </div>

            {/* Right Side: Navigation + Dropdown */}
            <div className="flex flex-col gap-2">
              {/* Navigation Buttons Row */}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => changeMonth(-1)}
                  className="rounded-full border bg-white shadow-lg hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => setDate(new Date())}>
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => changeMonth(1)}
                  className="rounded-full border bg-white shadow-lg hover:bg-gray-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Property Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full border shadow-lg"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">
                      {selectedProperty?.name}
                    </span>
                    <span className="sm:hidden">Property</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {hostProperties?.map((property) => (
                    <DropdownMenuItem
                      key={property.id}
                      onSelect={() => setSelectedProperty(property)}
                    >
                      {property.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="min-h-[600px] flex-1">
            <MonthCalendar
              date={date}
              reservedDateRanges={reservedDates}
              // onDateClick={handleDateClick}
              // selectedRange={selectedRange}
              // isEditing={editing}
              prices={prices}
              isLoading={isLoading}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {/* <Button
              variant="secondary"
              size="sm"
              className="flex-grow sm:flex-grow-0"
              onClick={handleBlockDates}
            >
              Block Dates
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-grow sm:flex-grow-0"
              onClick={handleUnblockDates}
            >
              Unblock Dates
            </Button> */}
            <Button
              variant="secondary"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              Edit iCal Link
            </Button>
            {/* <div className="w-full sm:w-auto sm:flex-1" />
            <Button
              variant="outline"
              size="sm"
              className="flex-grow sm:flex-grow-0"
              onClick={() => {
                setEditing(false);
                setSelectedRange({ start: null, end: null });
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-grow sm:flex-grow-0"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Done" : "Edit"}
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* SETTINGS */}
      {selectedProperty && <CalendarSettings property={selectedProperty} />}
    </div>
  );
}
