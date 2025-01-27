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
      className={cn("bg-white px-1 text-white", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-2 relative items-center",
        caption_label: "text-base font-semibold text-primaryGreen",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost", className: "rounded-full" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-primaryGreen rounded-md w-10 text-sm font-semibold uppercase",
        row: "flex w-full mt-1 ",
        cell: "h-10 w-10 text-center  text-sm p-0 relative [&:has([aria-selected].day-range-start)]:rounded-l-md [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 l aria-selected:opacity-100 font-semibold",
        ),
        day_range_start: "day-range-start text-primaryGreen",
        day_range_end: "day-range-end text-primaryGreen",
        day_selected:
          "bg-primaryGreen text-white hover:bg-primaryGreen [&>*]:rounded-none hover:text-primary-foreground focus:bg-primaryGreen focus:text-white",
        day_today: highlightToday ? "bg-accent text-primaryGreen" : "",
        // day_outside:
        // 	'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: "text-muted-foreground opacity-80 text-white",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-primaryGreen",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-5 w-5 text-primaryGreen" />,
        IconRight: () => <ChevronRight className="h-5 w-5 text-primaryGreen" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
