import { Property, REFERRAL_CODE_LENGTH } from "@/server/db/schema";
import { SeparatedData } from "@/server/server-utils";
import { useWindowSize } from "@uidotdev/usehooks";
import { clsx, type ClassValue } from "clsx";
import {
  formatDate,
  type FormatOptions,
  isSameDay,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { type RefObject, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { HostRequestsPageData } from "@/server/api/routers/propertiesRouter";
import * as cheerio from "cheerio";

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
  const dollars = round ? Math.round(cents / 100) : cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

/**
 * does the inverse of `formatCurrency`
 */
export function parseCurrency(str: string) {
  const dollars = parseFloat(str.replace(/[^0-9.-]+/g, ""));
  return Math.round(dollars * 100);
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

export function formatDateRange(
  fromDate: Date,
  toDate?: Date,
  { withWeekday = false } = {},
) {
  const from = removeTimezoneFromDate(fromDate);
  const to = toDate ? removeTimezoneFromDate(toDate) : "";

  const isCurYear = isSameYear(from, new Date());
  const sameMonth = isSameMonth(from, to);
  const sameYear = isSameYear(from, to);

  if (withWeekday) {
    if (!to || isSameDay(from, to)) {
      return formatDate(from, "EEE, MMM d, yyyy");
    }

    if (sameYear) {
      return `${formatDate(from, "EEE, MMM d")} – ${formatDate(
        to,
        isCurYear ? "EEE, MMM d" : "EEE, MMM d, yyyy",
      )}`;
    }
  }

  if (!to || isSameDay(from, to)) {
    const format = isCurYear ? "MMM d" : "MMM d, yyyy";
    return formatDate(from, format);
  }

  if (sameMonth && sameYear) {
    return `${formatDate(from, "MMM d")} – ${formatDate(
      to,
      isCurYear ? "d" : "d, yyyy",
    )}`;
  }
  if (sameYear) {
    return `${formatDate(from, "MMM d")} – ${formatDate(
      to,
      isCurYear ? "MMM d" : "MMM d, yyyy",
    )}`;
  }
  return `${formatDate(from, "MMM d, yyyy")} – ${formatDate(to, "MMM d, yyyy")}`;
}

/**
 * wrapper for formatDate for YYYY-MM-DD strings only that adds a T00:00
 * to the end of the date string to prevent the timezone from getting converted
 * to UTC and the formatted date being 1 day off.
 *
 * @example
 * ```js
 * formatDateString("2023-03-01", "MMM d, yyyy"); // Mar 1, 2023
 * ```
 */
export function formatDateString(
  date: string,
  formatStr: string,
  options: FormatOptions = {},
) {
  if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error("Invalid date format, must be YYYY-MM-DD");
  }
  return formatDate(`${date}T00:00`, formatStr, options);
}

// TODO: clean this all up (make it for strings only)

export function removeTimezoneFromDate(date: Date | string) {
  if (typeof date === "string") return date;
  return new Date(date).toISOString().split("Z")[0]!;
}

export function getDaysUntilTrip(checkIn: Date) {
  dayjs.extend(relativeTime);
  dayjs.extend(duration);

  const now = dayjs();

  const fmtdCheckIn = dayjs(checkIn).startOf("day");

  const daysToGo = Math.ceil(
    dayjs.duration(fmtdCheckIn.diff(now)).asDays() + 1,
  );

  return daysToGo;
}

//converts date string to a formatted date string with day name
//ex out put Mon, Aug 19
export function formatDateStringWithDayName(dateStr: string): string {
  // Convert the string to a Date object
  const dateObj = new Date(dateStr);

  // Define the format options
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };

  // Format the Date object to the desired string format
  return dateObj.toLocaleDateString("en-US", options);
}
export function formatDateMonthDay(date: Date | string) {
  if (typeof date === "string") return formatDateString(date, "MMMM d");
  return formatDate(removeTimezoneFromDate(date), "MMMM d");
}

export function formatDateWeekMonthDay(date: Date | string) {
  if (typeof date === "string") return formatDateString(date, "EEE, MMM d");
  return formatDate(removeTimezoneFromDate(date), "EEE, MMM d");
}

export function formatDateMonthDayYear(date: Date | string) {
  if (typeof date === "string") return formatDateString(date, "MMMM d, yyyy");
  return formatDate(removeTimezoneFromDate(date), "MMMM d, yyyy");
}

export function formatDateYearMonthDay(date: Date | string) {
  if (typeof date === "string") return formatDateString(date, "yyyy-MM-dd");
  return formatDate(removeTimezoneFromDate(date), "yyyy-MM-dd"); //ex 2021-12-31
}

export function formatShortDate(date: Date | string) {
  if (typeof date === "string") return formatDateString(date, "M/d/yyyy");
  return formatDate(removeTimezoneFromDate(date), "M/d/yyyy"); //ex 8/20/2024
}

export function convertDateFormat(dateString: string) {
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
}

export function addDays(date: Date, days: number): Date {
  //add days to a date object
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getElapsedTime(createdAt: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000,
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
}

export function getDisplayedName(realname: string | null): string {
  const userFirstName = realname?.split(" ")[0];
  const userLastName = realname?.split(" ")[1];
  const userLastNameInitial = userLastName
    ? userLastName[0]?.toUpperCase() + "."
    : "";
  const displayedName = userFirstName + " " + userLastNameInitial;
  return displayedName;
}
// not used right now and probably will never have to:

// export function formatDateRangeFromStrs(from: string, to?: string) {
//   const fromDate = new Date(from + "T00:00:00");
//   const toDate = to ? new Date(to + "T00:00:00") : undefined;

//   return formatDateRange(fromDate, toDate);
// }

// TODO: fix hacky

export function getNumNights(from: Date | string, to: Date | string) {
  return Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function getDirectListingPriceBreakdown({
  bookingCost,
}: {
  bookingCost: number;
}) {
  const stripeFee = 0.029 * bookingCost + 30; // Stripe fee calculation after markup (markup occured when offer was inserted)
  const serviceFee = stripeFee;
  const finalTotal = Math.floor(bookingCost + serviceFee);
  return {
    bookingCost,
    finalTotal,
    taxPaid: 0,
    serviceFee,
  };
}

export function getTramonaPriceBreakdown({
  bookingCost,
  numNights,
  superhogFee,
  tax,
}: {
  bookingCost: number;
  numNights: number;
  superhogFee: number;
  tax: number;
}) {
  const superhogFeePaid = numNights * superhogFee * 100;
  const taxPaid = (bookingCost + superhogFeePaid) * tax;
  const totalMinusStripe = bookingCost + superhogFeePaid + taxPaid;
  // should always cover the stripe fee + a little extra
  const stripeCoverFee = Math.ceil(totalMinusStripe * 0.04); //this 4 percent
  const serviceFee = superhogFeePaid + stripeCoverFee;
  const finalTotal = Math.floor(totalMinusStripe + stripeCoverFee);

  const priceBreakdown = {
    bookingCost: bookingCost,
    taxPaid: taxPaid,
    serviceFee: serviceFee,
    firstTotal: totalMinusStripe,
    finalTotal: finalTotal,
  };
  return priceBreakdown;
}

export function getHostPayout({
  propertyPrice,
  hostMarkup,
  numNights,
}: {
  propertyPrice: number;
  hostMarkup: number;
  numNights: number;
}) {
  return (
    Math.floor(propertyPrice * hostMarkup * numNights * 100) / 100
  ).toFixed(2);
}

export function getTravelerOfferedPrice({
  propertyPrice,
  travelerMarkup,
  numNights,
}: {
  propertyPrice: number;
  travelerMarkup: number;
  numNights: number;
}) {
  return (
    Math.ceil(propertyPrice * travelerMarkup * numNights * 100) / 100
  ).toFixed(2);
}

export function getPropertyId(url: string): number | null {
  const parsedUrl = new URL(url);
  const pathSegments = parsedUrl.pathname.split("/");
  const propertyId = pathSegments[pathSegments.length - 1];
  if (propertyId) {
    return parseInt(propertyId);
  } else {
    return null;
  }
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

export function formatArrayToString(
  arr: string[],
  { junction }: { junction: "and" | "or" } = { junction: "and" },
) {
  if (arr.length === 0) {
    return "";
  } else if (arr.length === 1) {
    return arr[0]!;
  } else if (arr.length === 2) {
    return `${arr[0]} ${junction} ${arr[1]}`;
  } else {
    const lastItem = arr.pop();
    const joinedItems = arr.join(", ");
    return `${joinedItems}, ${junction} ${lastItem}`;
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

const useScreenWidth = () => useWindowSize().width ?? 0;

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
 * screen width >= 1280 (same as tailwind `xl:`))
 */
export const useIsXl = () => useScreenWidth() >= 1280;

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

export function convertTo12HourFormat(time24: string) {
  // Split the input time into hours and minutes
  const [hourStr, minuteStr] = time24.split(":");
  let hours = parseInt(hourStr ?? "", 10);
  const minutes = parseInt(minuteStr ?? "", 10);

  // Determine the period (AM/PM)
  const period = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format the minutes to always be two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Combine the hours, minutes, and period
  const time12 = `${hours}:${formattedMinutes} ${period}`;

  return time12;
}

export function convertTo24HourFormat(time: string): string {
  // Assuming input format is HH:mm:ss
  const [hour, minute] = time.split(":");
  const formattedHour = (hour ?? "").padStart(2, "0");
  const formattedMinute = (minute ?? "").padStart(2, "0");
  return `${formattedHour}:${formattedMinute}`;
}

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

function isValidBirthdate(date: string) {
  // Regular expression to match MM/DD/YYYY format
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
  return regex.test(date);
}

export function getAge(birthdate: string) {
  if (!isValidBirthdate(birthdate)) {
    throw new Error("Invalid birthdate format. Please use MM/DD/YYYY.");
  }
  const [month, day, year] = birthdate.split("/").map(Number);

  if (month && year && day) {
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust age if the birthday has not occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }
}

export function formatTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  if (hour === undefined || minute === undefined) return time;
  const fmtdMinutes = minute < 10 ? `0${minute}` : minute;
  return hour > 12
    ? `${hour - 12}:${fmtdMinutes} PM`
    : `${hour}:${fmtdMinutes} AM`;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function separateByPriceRestriction(
  organizedData: HostRequestsPageData[],
): SeparatedData {
  const normal: HostRequestsPageData[] = [];
  const outsidePriceRestriction: HostRequestsPageData[] = [];

  organizedData.forEach((cityData) => {
    const normalRequests: HostRequestsPageData["requests"] = [];
    const outsideRequests: HostRequestsPageData["requests"] = [];

    cityData.requests.forEach((requestData) => {
      const normalProperties: Property[] = [];
      const outsideProperties: Property[] = [];

      requestData.properties.forEach((property) => {
        const nightlyPrice =
          requestData.request.maxTotalPrice /
          getNumNights(
            requestData.request.checkIn,
            requestData.request.checkOut,
          );
        if (
          property.priceRestriction == null ||
          property.priceRestriction * 100 <= nightlyPrice
        ) {
          if (property.city === "Seattle, WA, US") {
            console.log(property.priceRestriction, nightlyPrice);
          }
          normalProperties.push(property);
        } else {
          if (property.priceRestriction * 100 <= nightlyPrice * 1.15) {
            outsideProperties.push(property);
          }
        }
      });

      if (normalProperties.length > 0) {
        normalRequests.push({
          ...requestData,
          properties: normalProperties,
        });
      }

      if (outsideProperties.length > 0) {
        outsideRequests.push({
          ...requestData,
          properties: outsideProperties,
        });
      }
    });

    if (normalRequests.length > 0) {
      normal.push({
        city: cityData.city,
        requests: normalRequests,
      });
    }

    if (outsideRequests.length > 0) {
      outsidePriceRestriction.push({
        city: cityData.city,
        requests: outsideRequests,
      });
    }
  });

  return { normal, outsidePriceRestriction };
}

export function containsHTML(str: string) {
  const tags = [
    "<br />",
    "<br>",
    "<br/>",
    "<p>",
    "</p>",
    "<div>",
    "</div>",
    "<b>",
    "</b>",
    "<i>",
    "</i>",
    "<u>",
    "</u>",
    "<span>",
    "</span>",
    "<h1>",
    "</h1>",
    "<h2>",
    "</h2>",
    "<h3>",
    "</h3>",
    "<h4>",
    "</h4>",
  ];

  return tags.filter((tag) => str.includes(tag)).length >= 2;
}

export function mulberry32(seed: number) {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// falls back to a random discount between 8% and 12% if the original nightly price is not available
export function getOfferDiscountPercentage(offer: {
  createdAt: Date;
  travelerOfferedPrice: number;
  checkIn: Date;
  checkOut: Date;
  scrapeUrl?: number | null;
  datePriceFromAirbnb: number | null;
  randomDirectListingDiscount?: number | null;
}) {
  const numNights = getNumNights(offer.checkIn, offer.checkOut);
  const offerNightlyPrice = offer.travelerOfferedPrice / numNights;
  //1.)check to see if scraped property(directListing) and the randomDirectListingDiscount is not null
  if (offer.randomDirectListingDiscount) {
    return offer.randomDirectListingDiscount;
  }

  //2.) check if the property is going to be booked directly on airbnb TODO

  //3.) check the if the offer is by a real host and is listed on airbnb
  if (offer.datePriceFromAirbnb) {
    return getDiscountPercentage(offer.datePriceFromAirbnb, offerNightlyPrice);
  }
  //4.)for other cases random number
  else return Math.round(8 + 4 * mulberry32(offer.createdAt.getTime())); // random number between 8 and 12, deterministic based on offer creation time
}

export function createRandomMarkupEightToFourteenPercent() {
  return Math.floor(Math.random() * 7 + 8);
}

export function parseHTML(str: string) {
  const ret = cheerio
    .load(
      str
        .replaceAll("<br />", "\n")
        .replaceAll("<br/>", "\n")
        .replaceAll("<br>", "\n"),
    )(":root")
    .prop("innerText");

  if (ret === null) throw new Error("Failed to parse HTML");
  return ret;
}

export function censorEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!domain) {
    return "Invalid email format";
  }

  const censoredName = name![0] + "*".repeat(name!.length - 1);

  return censoredName + "@" + domain;
}

export function censorPhoneNumber(phoneNumber: string) {
  // Regex to match the area code
  const regex = /^(\+\d{1,3})(\d{3})\d{7}$/;

  if (regex.test(phoneNumber)) {
    // Replace the parts of the number that are not in the area code
    return phoneNumber.replace(/(^\+\d{1,3})(\d{3})(\d{7})$/, "$1$2*** - ****");
  }

  return "Invalid phone number format";
}

export function censorTravelerFullName(name: string) {
  return name;
}
