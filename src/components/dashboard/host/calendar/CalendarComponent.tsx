"use client";
import React, { useMemo } from "react";
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
import { cn } from "@/utils/utils";
import MonthCalendar from "./MonthCalendar";
import CalendarSettings from "./CalendarSettings";
import { useState } from "react";

type ReservationInfo = {
  start: string;
  end: string;
  platformBookedOn: "airbnb" | "tramona";
};
export default function CalendarComponent() {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const hostProperties = api.properties.getHostProperties.useQuery();
  const [selectedProperty, setSelectedProperty] = useState(
    hostProperties.data?.[0],
  );
  const [editing, setEditing] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const queryInput = useMemo(() => ({
    propertyId: selectedProperty?.hospitableListingId,
  }), [selectedProperty?.hospitableListingId]);

  const { data: hospitableCalendarPrices } =
    api.pms.getHospitableCalendar.useQuery(queryInput);


  const prices = useMemo(() => {
    const priceMap: Record<string, number | undefined> = {};
    const initialDate = new Date(date.getFullYear(), date.getMonth(), 1);

    for (let i = 0; i < 31 && initialDate.getMonth() === date.getMonth(); i++) {
      const dateString = initialDate.toISOString().split("T")[0]!;
      priceMap[dateString] =
        hospitableCalendarPrices?.find((event) => event.date === dateString)?.price.amount/100;

      // Clone initialDate to avoid mutating it
      initialDate.setDate(initialDate.getDate() + 1);
    }

    return priceMap;
  }, [date, hospitableCalendarPrices]);

  console.log(
    "hospitableCalendarPrices",
    hospitableCalendarPrices,
    selectedProperty,
  );

  const reservedDates = hospitableCalendarPrices
    ?.filter((price) => !price.availability.available)
    .map((price) => ({
      start: price.date,
      end: price.date,
      platformBookedOn: "tramona",
    }));

  console.log("reservedDates", reservedDates);

  const handleDateClick = (date: Date) => {
    if (!editing) return;

    setSelectedRange((prev) => {
      if (!prev.start) {
        return { start: date, end: date };
      }
      if (!prev.end) {
        if (date < prev.start) {
          return { start: date, end: prev.start };
        }
        return { ...prev, end: date };
      }
      return { start: date, end: date };
    });
  };

  const handleBlockDates = async () => {
    if (!selectedRange.start || !selectedRange.end) return;

    try {
      // Add your API call here to block dates
      console.log("Blocking dates:", selectedRange);
      setSelectedRange({ start: null, end: null });
    } catch (error) {
      console.error("Error blocking dates:", error);
    }
  };

  const handleUnblockDates = async () => {
    if (!selectedRange.start || !selectedRange.end) return;

    try {
      // Add your API call here to unblock dates
      console.log("Unblocking dates:", selectedRange);
      setSelectedRange({ start: null, end: null });
    } catch (error) {
      console.error("Error unblocking dates:", error);
    }
  };

  const isDateReserved = (date: Date): ReservationInfo | undefined => {
    return reservedDates.find((reservation) => {
      const start = new Date(reservation.start);
      const end = new Date(reservation.end);
      return date >= start && date < end;
    });
  };

  const dayWithPrice = (day: Date, prices: Record<string, number>) => {
    const dateStr = day.toISOString().split("T")[0]!;
    const reservedInfo = isDateReserved(day);

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
        className={cn(
          "h-14 w-full p-1 sm:h-20 sm:p-2",
          "flex flex-col justify-between",
          "hover:bg-accent hover:text-accent-foreground",
          reservationClass,
          selectedDates.some((d) => d.getTime() === day.getTime()) &&
            "bg-blue-200",
        )}
      >
        <span className="text-xs font-medium sm:text-sm">{day.getDate()}</span>
        <span className="text-[10px] text-muted-foreground sm:text-xs">
          ${prices[dateStr] ?? 168}
        </span>
      </div>
    );
  };



  const changeMonth = (increment: number) => {
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth() + increment,
      1,
    );
    setDate(newDate);
  };

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
                <p className="py-1">15 vacancies this month</p>
                <p>$1000 left on the table</p>
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
                  {hostProperties.data?.map((property) => (
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
              onDateClick={handleDateClick}
              selectedRange={selectedRange}
              isEditing={editing}
              prices={prices}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
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
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-grow sm:flex-grow-0"
            >
              Edit iCal Link
            </Button>
            <div className="w-full sm:w-auto sm:flex-1" />
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
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SETTINGS */}
      <CalendarSettings />
    </div>
  );
}
