import { REFERRAL_CODE_LENGTH } from "@/server/db/schema";
import { useWindowSize } from "@uidotdev/usehooks";
import { clsx, type ClassValue } from "clsx";
import {
  format,
  formatDate,
  isSameDay,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { type RefObject, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateReferralCode() {
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = "";

  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Examples:
 * ```js
 * plural(1, "apple") => "1 apple"
 * plural(2, "apple") => "2 apples"
 * plural(2, "octopus", "octopi") => "2 octopi"
 * ```
 */
export function plural(count: number, noun: string, pluralNoun?: string) {
  if (count === 1) return `1 ${noun}`;
  return `${count} ${pluralNoun ? pluralNoun : noun + "s"}`;
}

/**
 * formats the price IN CENTS
 *
 * Examples:
 * ```js
 * formatCurrency(10) => "$0.10"
 * formatCurrency(2000) => "$20.00"
 * ```
 */
export function formatCurrency(cents: number, { round = false } = {}) {
  if (cents % 100 === 0 || round) return `$${Math.round(cents / 100)}`;
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Examples:
 * ```js
 * capitalize("apple") => "Apple"
 * capitalize("ASDF") => "ASDF"
 * ```
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Example outputs:
 * ```js
 * "Jan 1, 2021"
 * "Jan 1 – 2, 2021"
 * "Jan 1 – Feb 2, 2021"
 * "Jan 1, 2021 – Feb 2, 2022"
 * ```
 */
export function formatDateRange(fromDate: Date, toDate?: Date) {
  const from = removeTimezoneFromDate(fromDate);
  const to = toDate ? removeTimezoneFromDate(toDate) : "";

  const isCurYear = isSameYear(from, new Date());

  if (!to || isSameDay(from, to)) {
    return format(from, isCurYear ? "MMM d" : "MMM d, yyyy");
  }

  const sameMonth = isSameMonth(from, to);
  const sameYear = isSameYear(from, to);

  if (sameMonth && sameYear) {
    return `${format(from, "MMM d")} – ${format(
      to,
      isCurYear ? "d" : "d, yyyy",
    )}`;
  }
  if (sameYear) {
    return `${format(from, "MMM d")} – ${format(
      to,
      isCurYear ? "MMM d" : "MMM d, yyyy",
    )}`;
  }
  return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
}

function removeTimezoneFromDate(date: Date) {
  // Convert to ISO string and split by 'T' to get date part
  return new Date(date).toISOString().split("Z")[0]!;
}

export function formatDateMonthDay(date: Date) {
  return formatDate(removeTimezoneFromDate(date), "MMMM d");
}

export function formatDateWeekMonthDay(date: Date) {
  return formatDate(removeTimezoneFromDate(date), "EEE MMMM d");
}

export function formatDateMonthDayYear(date: Date) {
  return formatDate(removeTimezoneFromDate(date), "MMMM d, yyyy");
}

// not used right now and probably will never have to:

// export function formatDateRangeFromStrs(from: string, to?: string) {
//   const fromDate = new Date(from + "T00:00:00");
//   const toDate = to ? new Date(to + "T00:00:00") : undefined;

//   return formatDateRange(fromDate, toDate);
// }

// todo fix hacky
export function getNumNights(from: Date | string, to: Date | string) {
  return Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24),
  );
}

/**
 * @returns `now`, `10 minutes`, `5 hours`, `2 days`, `1 week`, `10 weeks`, etc
 */
export function formatInterval(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks) return plural(weeks, "week");
  if (days) return plural(days, "day");
  if (hours > 18) return "1 day";
  if (hours) return plural(hours, "hr");
  if (minutes) return plural(minutes, "minute");
  return "now";
}

export function formatArrayToString(arr: string[]) {
  if (arr.length === 0) {
    return "";
  } else if (arr.length === 1) {
    return arr[0]!;
  } else if (arr.length === 2) {
    return `${arr[0]} and ${arr[1]}`;
  } else {
    const lastItem = arr.pop();
    const joinedItems = arr.join(", ");
    return `${joinedItems}, and ${lastItem}`;
  }
}

export async function retry<T>(f: Promise<T>, numRetries: number) {
  for (let i = 0; i < numRetries; i++) {
    try {
      return await f.catch(() => {
        throw new Error();
      });
    } catch (err) {}
  }
}

export function getDiscountPercentage(
  originalPrice: number,
  discountPrice: number,
) {
  return Math.round((1 - discountPrice / originalPrice) * 100);
}

// functions for when css doesnt cut it for showing/hiding stuff on screens
// use these as a last resort cuz it can cause jank with ssr (unless the element isnt
// visible on the first render in which case it doesnt matter for ssr)

// these will need to be kept in sync with
// https://tailwindcss.com/docs/screens and ./tailwind.config.ts

export const useScreenWidth = () => useWindowSize().width ?? 0;

/**
 * screen width >= 640 (same as tailwind `sm:`)
 */
export const useIsSm = () => useScreenWidth() >= 640;

/**
 * screen width >= 768 (same as tailwind `md:`)
 */
export const useIsMd = () => useScreenWidth() >= 768;

/**
 * screen width >= 1024 (same as tailwind `lg:`))
 */
export const useIsLg = () => useScreenWidth() >= 1024;

/**
 * screen width >= 1850 (same as tailwind `lg:`))
 */
export const useIsXl = () => useScreenWidth() >= 1850;

export function getFromAndTo(page: number, itemPerPage: number) {
  let from = page * itemPerPage;

  const to = from + itemPerPage;

  if (page > 0) {
    from += 1;
  }

  return { from, to };
}

// hopefully we wont need this
export function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000,
  );

  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

export function checkDuplicates(nums: number[]) {
  const set = new Set();

  for (const num of nums) {
    if (set.has(num)) {
      return true;
    }

    set.add(num);
  }

  return false;
}

export const generateTimeStamp = () => {
  const date = new Date();
  const milliseconds = Math.round(date.getMilliseconds() / 10); // Round to 2 decimal places
  const formattedMilliseconds = milliseconds.toString().padStart(2, "0"); // Ensure 2 digits

  const formattedTimestamp: string =
    date.toISOString().slice(0, -5) + "." + formattedMilliseconds;

  return formattedTimestamp;
};

export function useOverflow(ref: RefObject<HTMLDivElement>): boolean {
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const handleResize = () => {
        setIsOverflowing(element.scrollWidth > element.clientWidth);
      };

      handleResize();

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [ref]);

  return isOverflowing;
}

// export function formatDateRangeWithWeekday(
//   fromDate: Date | string,
//   toDate?: Date | string,
// ) {
//   // Convert to Date objects if necessary
//   //converting because the gssp function returns a string
//   if (typeof fromDate === "string") {
//     fromDate = new Date(fromDate);
//   }
//   if (typeof toDate === "string") {
//     toDate = new Date(toDate);
//   }

//   fromDate = removeTimezoneFromDate(fromDate);
//   toDate = toDate && removeTimezoneFromDate(toDate);

//   const options: Intl.DateTimeFormatOptions = {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//   };

//   const fromFormatted = fromDate.toLocaleDateString("en-US", options);
//   const toFormatted = toDate
//     ? (toDate as Date).toLocaleDateString("en-US", options)
//     : "";

//   return toDate ? `${fromFormatted} - ${toFormatted}` : fromFormatted;
// }
