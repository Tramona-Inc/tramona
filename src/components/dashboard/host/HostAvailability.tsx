import { type Property } from "@/server/db/schema/tables/properties";
import { HostPropertyEditBtn } from "./HostPropertiesLayout";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  MoveLeft,
  MoveRight,
} from "lucide-react";

export default function HostAvailability({ property }: { property: Property }) {
  const [editing, setEditing] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date()); // actual current date
  const [calendarDate, setCalendarDate] = useState<Date>(new Date()); // date displayed on the calendar

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const today = new Date();
    console.log(today.toString());
    setCurrentDate(today);
    setCalendarDate(today);
  }, []);

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

    return (
      <div className="w-1/2 px-2">
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="mb-1 text-center text-sm font-bold text-gray-500"
            >
              {day.toUpperCase()}
            </div>
          ))}
          {monthDays.map((day, index) => (
            <div
              key={index}
              className={`flex h-12 flex-1 items-center justify-center font-semibold 
                ${day ? "cursor-pointer bg-zinc-50" : ""} 
                ${
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
          ))}
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
    <div className=" min-h-screen-minus-header-n-footer  space-y-10">
      <div className="text-end">
        <HostPropertyEditBtn
          editing={editing}
          setEditing={setEditing}
          property={property}
        />
      </div>
      <div className="mx-auto max-w-4xl">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="relative basis-1/2 text-center">
              <button
                onClick={goToPreviousMonth}
                className="absolute left-0 top-0 mr-2 rounded border border-gray-300 p-2 text-gray-400 transition-colors duration-150 hover:text-gray-600"
              >
                <MoveLeft className="h-4 w-4" />
              </button>
              <h3 className="text-xl font-bold text-gray-800">
                {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
              </h3>
            </div>
            <div className="relative basis-1/2 text-center">
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
          <div className="-mx-2 flex">
            {renderMonth(0)}
            {renderMonth(1)}
          </div>
          <div className="mt-12 flex flex-col space-y-2 text-sm">
            <div className="flex items-center">
              <div className="mr-2 h-6 w-6 bg-zinc-50"></div>
              <span className="text-muted-foreground">Vacant</span>
            </div>
            <div className="flex items-center">
              <div
                className="mr-2 h-6 w-6 bg-zinc-200"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, red, red 1px, transparent 1px, transparent 4px)",
                }}
              ></div>
              <span className="text-muted-foreground">Blocked dates</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-6 w-6  bg-blue-100"></div>
              <span className="text-muted-foreground">Booked on Tramona</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
