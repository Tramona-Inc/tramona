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
export function formatCurrency(cents: number) {
  if (cents % 100 === 0) return `$${cents / 100}`;
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
  const from = removeTimezoneFromDate(fromDate) ?? "";
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
  return new Date(date).toISOString().split("Z")[0]; // todo fix hacky
}

export function formatDateMonthDay(date: Date) {
  return formatDate(date, "MMMM d");
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

// https://tailwindcss.com/docs/screens + tailwind.config.ts

export const useScreenWidth = () => useWindowSize()?.width ?? 0;
export const useIsDesktop = () => useScreenWidth() >= 640;
export const useIsMd = () => useScreenWidth() >= 768;
export const useIsLg = () => useScreenWidth() >= 1024;

export function getTramonaFeeTotal(totalSavings: number) {
  const fee = 0.2 * totalSavings;

  return fee;
}

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