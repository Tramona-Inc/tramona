"use client";

import * as React from "react";
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
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedProperty, setSelectedProperty] =
    React.useState("All Properties");
  const [editing, setEditing] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  // Example properties - replace with your API call
  const properties = [
    "The best place in SD",
    "Cozy Downtown Loft",
    "Beachfront Paradise",
    "Mountain Retreat",
  ];

  // Replace with your actual API call
  const { data: reservedDateRanges, isLoading } =
    api.calendar.getReservedDateRanges.useQuery({
      propertyId: "property-id",
    });

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

  const dayWithPrice = (day: Date, prices: { [key: string]: number }) => {
    const dateStr = day.toISOString().split("T")[0];
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
          ${prices[dateStr] || 168}
        </span>
      </div>
    );
  };

  const prices = React.useMemo(() => {
    const priceMap: { [key: string]: number } = {};
    const currentDate = new Date(date.getFullYear(), date.getMonth(), 1);
    while (currentDate.getMonth() === date.getMonth()) {
      priceMap[currentDate.toISOString().split("T")[0]] = 168;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return priceMap;
  }, [date]);

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
          <div className="mb-4 flex flex-col items-start justify-between gap-2 sm:mb-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <div className="text-xs text-muted-foreground sm:text-sm">
                <p>15 vacancies this month</p>
                <p>$1000 left on the table</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => changeMonth(-1)}
                className="rounded-full border bg-white shadow-lg hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={() => setDate(new Date())}>
                {date.toLocaleString("default", { month: "long" })}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => changeMonth(1)}
                className="rounded-full border bg-white shadow-lg hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="ml-0 rounded-full border shadow-lg sm:ml-4"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{selectedProperty}</span>
                    <span className="sm:hidden">Property</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {properties.map((property) => (
                    <DropdownMenuItem
                      key={property}
                      onSelect={() => setSelectedProperty(property)}
                    >
                      {property}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="min-h-[600px] flex-1">
            <MonthCalendar
              date={date}
              reservedDateRanges={reservedDateRanges}
              onDateClick={handleDateClick}
              selectedRange={selectedRange}
              isEditing={editing}
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
