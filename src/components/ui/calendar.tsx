import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/utils/utils";
import { buttonVariants } from "./button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  highlightToday?: boolean;
};

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  highlightToday = false,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-white p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center px-8",
        caption_label: "text-sm font-semibold text-[#004236]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-100 absolute",
          "text-[#004236] hover:bg-white hover:text-[#006a56] rounded-full",
        ),
        nav_button_previous: "left-1",
        nav_button_next: "right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-[#004236] rounded-md w-9 font-semibold text-[0.8rem] uppercase",
        row: "flex w-full mt-2",
        cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-medium text-[#004236] hover:bg-white hover:text-[#006a56] aria-selected:opacity-100",
        ),
        day_range_start: "day-range-start rounded-l-md",
        day_range_end: "day-range-end rounded-r-md",
        day_selected:
          "bg-[#004236] text-white hover:bg-[#006a56] hover:text-white focus:bg-[#004236] focus:text-white font-semibold",
        day_today: highlightToday
          ? "border border-[#004236] text-[#004236] font-semibold"
          : "",
        day_outside: "text-[#004236]/40 opacity-50 font-medium",
        day_disabled:
          "text-gray-300 opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-300",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
