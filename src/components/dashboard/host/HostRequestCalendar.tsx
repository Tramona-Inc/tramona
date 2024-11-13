import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PropertyAvailabilityCalendar({
  title,
  details,
  occupancyText,
}) {
  const [baseDate, setBaseDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getMonthData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayIndex = firstDay.getDay();

    return {
      year,
      month,
      daysInMonth,
      startingDayIndex,
      monthName: date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    };
  };

  const monthData = getMonthData(baseDate);

  const navigateMonth = (direction) => {
    const newDate = new Date(baseDate);
    newDate.setMonth(baseDate.getMonth() + direction);
    setBaseDate(newDate);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(monthData.year, monthData.month, day);
    setSelectedDate(clickedDate);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(monthData.year, monthData.month, day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const renderMonth = (monthData) => {
    const days = [];

    for (let i = 0; i < monthData.startingDayIndex; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="flex h-8 items-center justify-center text-sm text-gray-400"
        />,
      );
    }

    for (let day = 1; day <= monthData.daysInMonth; day++) {
      const date = new Date(monthData.year, monthData.month, day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = isDateSelected(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`flex h-8 cursor-pointer items-center justify-center text-sm hover:bg-gray-100 ${isSelected ? "bg-primaryGreen text-white hover:bg-primaryGreen" : ""} ${isToday && !isSelected ? "font-medium text-teal-600" : ""}`}
        >
          {day}
        </button>,
      );
    }

    const totalCells = 42;
    const remainingCells =
      totalCells - (days.length + monthData.startingDayIndex);
    for (let i = 0; i < remainingCells; i++) {
      days.push(
        <div
          key={`empty-end-${i}`}
          className="flex h-8 items-center justify-center text-sm text-gray-400"
        />,
      );
    }

    return (
      <div className="w-full">
        <div className="mb-4 flex items-center justify-between">
          <button
            className="rounded-full p-1 hover:bg-gray-100"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="text-center font-medium">{monthData.monthName}</div>
          <button
            className="rounded-full p-1 hover:bg-gray-100"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="flex h-8 items-center justify-center text-xs text-gray-500"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full bg-white p-4 md:p-6">
      <div className="flex flex-col space-y-6 md:flex-row md:space-x-8 md:space-y-0">
        {/* Left side - Property details */}
        <div className="flex flex-col md:w-1/2 md:flex-row">
          {/* Image and text container */}
          <img
            src="https://via.placeholder.com/96"
            alt="Property"
            className="mb-4 h-[200px] w-full rounded-lg object-cover md:mb-0 md:h-[300px] md:w-[300px]"
          />
          <div className="md:ml-4">
            <h2 className="mb-2 text-xl font-semibold md:text-2xl">{title}</h2>
            <div className="text-sm text-gray-600 md:text-base">
              {details.guests} guests • {details.bedrooms} bedrooms •{" "}
              {details.beds} beds • {details.baths} baths
            </div>
            <div className="mt-2 text-sm text-gray-500 md:text-base">
              {occupancyText}
            </div>
          </div>
        </div>

        {/* Right side - Calendar */}
        <div className="md:w-1/2">{renderMonth(monthData)}</div>
      </div>
    </Card>
  );
}
