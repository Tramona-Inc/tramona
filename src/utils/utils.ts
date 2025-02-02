import { Offer, Property, REFERRAL_CODE_LENGTH } from "@/server/db/schema";
import { RequestsPageOfferData, SeparatedData } from "@/server/server-utils";
import { useWindowSize } from "@uidotdev/usehooks";
import { clsx, type ClassValue } from "clsx";
import {
  differenceInYears,
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
import {
  HostRequestsPageData,
  HostRequestsPageOfferData,
} from "@/server/api/routers/propertiesRouter";
import * as cheerio from "cheerio";
import { useSession } from "next-auth/react";
import { api } from "./api";
import { HOST_MARKUP, TRAVELER_MARKUP } from "./constants";
import { InferQueryModel } from "@/server/db";
import {
  TripWithDetails,
  TripWithDetailsConfirmation,
} from "@/components/my-trips/TripPage";
import axios from "axios";

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

export function generatePhoneNumberOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
  if (!str) return;
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

export function getHostPayout(totalBasePriceBeforeFees: number) {
  return Math.floor(totalBasePriceBeforeFees * HOST_MARKUP);
}

export function getTravelerOfferedPrice({
  totalBasePriceBeforeFees,
  travelerMarkup, //we need this because can be traveler or direct listing markup
}: {
  totalBasePriceBeforeFees: number;
  travelerMarkup: number;
}) {
  return Math.ceil(totalBasePriceBeforeFees * travelerMarkup);
}

export function removeTravelerMarkup(amountWithTravelerMarkup: number) {
  const basePrice = amountWithTravelerMarkup / TRAVELER_MARKUP;
  return Math.round(basePrice);
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

export const useIsXs = () => useScreenWidth() < 640;
/**
 * screen width >= 640 (same as tailwind `sm:`)
 */
export const useIsSm = () => useScreenWidth() >= 640;

/**
 * screen width >= 768 (same as tailwind `md:`)
 */
export const useIsMd = () => useScreenWidth() >= 768;

/**
 * for screen w md Screens
 */

export const useIsOnlyMd = () => {
  const screenWidth = useScreenWidth();
  return screenWidth >= 768 && screenWidth < 1024;
};
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

export function getAge(birthdate: string) {
  return differenceInYears(new Date(), new Date(birthdate));
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

export function separateByPriceAndAgeRestriction(
  organizedData: HostRequestsPageData[],
): SeparatedData {
  const processedData = organizedData.map((cityData) => {
    const processedRequests = cityData.requests.map((requestData) => {
      const nightlyPrice =
        requestData.request.maxTotalPrice /
        getNumNights(requestData.request.checkIn, requestData.request.checkOut);

      const travelerAge = requestData.request.traveler.dateOfBirth
        ? getAge(requestData.request.traveler.dateOfBirth)
        : null;

      const normalProperties = requestData.properties.filter((property) => {
        if (property.city === "Seattle, WA, US") {
          console.log(property.priceRestriction, nightlyPrice);
        }
        return (
          (property.priceRestriction == null ||
            property.priceRestriction <= nightlyPrice) &&
          (property.ageRestriction == null ||
            (travelerAge !== null && travelerAge >= property.ageRestriction))
        );
      });

      const outsideProperties = requestData.properties.filter(
        (property) =>
          property.priceRestriction != null &&
          property.priceRestriction >= nightlyPrice * 1.15 &&
          property.ageRestriction != null &&
          (travelerAge === null || travelerAge < property.ageRestriction),
      );

      return {
        normal:
          normalProperties.length > 0
            ? { ...requestData, properties: normalProperties }
            : null,
        outside:
          outsideProperties.length > 0
            ? { ...requestData, properties: outsideProperties }
            : null,
      };
    });

    const normalRequests = processedRequests
      .map((req) => req.normal)
      .filter(
        (req): req is HostRequestsPageData["requests"][number] => req !== null,
      );
    const outsideRequests = processedRequests
      .map((req) => req.outside)
      .filter(
        (req): req is HostRequestsPageData["requests"][number] => req !== null,
      );

    return {
      normal: {
        city: cityData.city,
        requests: normalRequests,
      },
      outsidePriceRestriction: {
        city: cityData.city,
        requests: outsideRequests,
      },
    };
  });

  return {
    normal: processedData.map((data) => data.normal),
    outsidePriceRestriction: processedData.map(
      (data) => data.outsidePriceRestriction,
    ),
  };
}

export function formatOfferData(
  organizedData: HostRequestsPageOfferData[],
): RequestsPageOfferData {
  return {
    sent: organizedData,
  };
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

export function originalListingIdToRandomDiscount(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i); // hash * 31 + charCode
    hash |= 0; // convert to 32bit integer
  }
  // normalize hash to a float
  const normalizedValue = (hash >>> 0) / 4294967296;
  // scale to range [8, 14]
  return 8 + normalizedValue * (14 - 8);
}

// falls back to a random discount between 8% and 12% if the original nightly price is not available
export function getOfferDiscountPercentage(
  offer: Pick<
    Offer,
    | "createdAt"
    | "travelerOfferedPrice"
    | "checkIn"
    | "checkOut"
    | "scrapeUrl"
    | "datePriceFromAirbnb"
    | "randomDirectListingDiscount"
  >,
) {
  //1.)check to see if scraped property(directListing) and the randomDirectListingDiscount is not null
  if (offer.randomDirectListingDiscount) {
    return offer.randomDirectListingDiscount;
  }

  //2.) check if the property is going to be booked directly on airbnb TODO

  //3.) check the if the offer is by a real host and is listed on airbnb
  if (offer.datePriceFromAirbnb) {
    console.log(offer.datePriceFromAirbnb, offer.travelerOfferedPrice);
    return getDiscountPercentage(
      offer.datePriceFromAirbnb,
      offer.travelerOfferedPrice,
    );
  }
  //4.)for other cases random number
  else return Math.round(8 + 4 * mulberry32(offer.createdAt.getTime())); // random number between 8 and 12, deterministic based on offer creation time
}

// export function getrequestToBookMaxDiscountPercentage(offer: {
//   createdAt: Date;
//   travelerOfferedPrice: number;
//   checkIn: Date;
//   checkOut: Date;
//   scrapeUrl?: number | null;
//   datePriceFromAirbnb: number | null;
//   randomDirectListingDiscount?: number | null;
// }) {
//   const numNights = getNumNights(offer.checkIn, offer.checkOut);
//   const offerNightlyPrice = offer.travelerOfferedPrice / numNights;
//   //1.)check to see if scraped property(directListing) and the randomDirectListingDiscount is not null
//   if (offer.randomDirectListingDiscount) {
//     return offer.randomDirectListingDiscount;
//   }

//   //2.) check if the property is going to be booked directly on airbnb TODO

//   //3.) check the if the offer is by a real host and is listed on airbnb
//   if (offer.datePriceFromAirbnb) {
//     console.log(
//       offer.datePriceFromAirbnb,
//       offer.travelerOfferedPrice,
//     );
//     return getDiscountPercentage(
//       offer.datePriceFromAirbnb,
//       offer.travelerOfferedPrice,
//     );
//   }
//   //4.)for other cases random number
//   else return Math.round(8 + 4 * mulberry32(offer.createdAt.getTime())); // random number between 8 and 12, deterministic based on offer creation time
// }

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

export function logAndFilterSettledResults<T>(
  results: PromiseSettledResult<T>[],
) {
  return results
    .filter((r) => {
      if (r.status === "rejected") console.error(r.reason);
      return r.status === "fulfilled";
    })
    .map((r) => r.value);
}

export function useUpdateUser() {
  const { mutateAsync: updateProfile } = api.users.updateProfile.useMutation();
  const { update } = useSession();

  return {
    updateUser: async (updates: Parameters<typeof updateProfile>[0]) => {
      await updateProfile(updates);
      await update();
    },
  };
}

export function removeTax(total: number, taxRate: number): number {
  if (taxRate < 0 || taxRate >= 1) {
    throw new Error("Tax rate must be between 0 and 1");
  }
  const amountWithoutTax = Math.round(total / (1 + taxRate));
  return amountWithoutTax;
}

export const getApplicableBookItNowDiscount = (
  property: Pick<Property, "bookItNowHostDiscountPercentOffInput">,
) => {
  const discountPercentage = property.bookItNowHostDiscountPercentOffInput;
  return discountPercentage;
};

export const capitalizeFirstLetter = (string: string | null): string => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Function to lowercase the first letter

export const lowerCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1).toLowerCase();
};

export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function getHostNameAndImage(
  property: InferQueryModel<
    "properties",
    {
      columns: {
        id: true;
        hostName: true;
        hostProfilePic: true;
      };
      with: {
        hostTeam: {
          with: {
            owner: {
              columns: {
                firstName: true;
                lastName: true;
                name: true;
                image: true;
              };
            };
          };
        };
      };
    }
  >,
) {
  const teamOwner = property.hostTeam.owner;

  const ownerName =
    teamOwner.firstName && teamOwner.lastName
      ? `${teamOwner.firstName} ${teamOwner.lastName}`
      : teamOwner.name;

  if (!ownerName) {
    throw new Error(`Host name not found for property ${property.id}`);
  }

  // since we will be hosting scraped properties from a tramona host team, we want
  // to use the hostName and hostProfilePic if they exist, otherwise we use the
  // team owner's name and image. Hopefully hostName and hostProfilePic will be
  // available for scraped properties, but if they're not, it will fall back to
  // saying "hosted by Tramona". And for non-scraped properties, hostName and
  // hostProfilePic will be null, so this will return the team owner's name and
  // image as intended.
  return {
    name: property.hostName ?? ownerName,
    image: property.hostProfilePic ?? teamOwner.image,
  };
}

type InteractionPreferences =
  | "not available"
  | "say hello"
  | "socialize"
  | "no preference"
  | null;

export function convertInteractionPreference(pref: InteractionPreferences) {
  let modifiedPref = null;
  switch (pref) {
    case "not available":
      modifiedPref =
        "I won't be available in person, and prefer communicating through the app.";
      break;
    case "say hello":
      modifiedPref =
        "I like to say hello in person, but keep to myself otherwise.";
      break;
    case "socialize":
      modifiedPref = "I like socializing and spending time with guests.";
      break;
    case "no preference":
      modifiedPref = "No preferences - I follow my guests' lead.";
      break;
  }

  return modifiedPref;
}

export function isTrip5pmBeforeCheckout(
  tripData: TripWithDetails | TripWithDetailsConfirmation,
) {
  const { trip } = tripData;

  const now = new Date();

  const checkoutDate = new Date(trip.checkOut);

  const targetDate = new Date(checkoutDate);
  // set target date to day before checkout date
  targetDate.setDate(checkoutDate.getDate() - 1);
  // set time to 5:00 pm
  targetDate.setHours(17, 0, 0, 0);

  // check if current date is after 5 pm on the day before checkout
  return now >= targetDate;
}

export function isTripWithin48Hours(
  tripData: TripWithDetails | TripWithDetailsConfirmation,
) {
  const { trip } = tripData;
  // now: current date and time
  const now = new Date();

  const checkInDate = new Date(trip.checkIn);
  // targetDate: 48 hours before check-in date
  const targetDate = new Date(checkInDate.getTime() - 48 * 60 * 60 * 1000);

  // check if current date is after target date
  return now >= targetDate;
}

export function convertMonthToNumber(month: string) {
  switch (month) {
    case "January":
      return 0;
    case "February":
      return 1;
    case "March":
      return 2;
    case "April":
      return 3;
    case "May":
      return 4;
    case "June":
      return 5;
    case "July":
      return 6;
    case "August":
      return 7;
    case "September":
      return 8;
    case "October":
      return 9;
    case "November":
      return 10;
    case "December":
      return 11;
    default:
      return 0;
  }
}

export function validateDateValues({
  day,
  month,
  year,
}: {
  day: number;
  month: number;
  year: number;
}) {
  if (year < 1900 || year > new Date().getFullYear()) {
    return "Please enter a valid year";
  }
  if (month >= 0 && month <= 6) {
    if (month % 2 === 0) {
      if (day < 1 || day > 31) {
        return "Please enter a valid day";
      }
    } else {
      if (day < 1 || day > 30) {
        return "Please enter a valid day";
      }
    }
  } else {
    if (month % 2 === 0) {
      if (day < 1 || day > 30) {
        return "Please enter a valid day";
      } else {
        if (day < 1 || day > 31) {
          return "Please enter a valid day";
        }
      }
    }
  }
  return "valid";
}

export function toReversed<T>(arr: T[]) {
  return [...arr].reverse();
}

export function formatRelativeDateShort(
  date: Date,
  { withSuffix }: { withSuffix?: boolean } = {},
) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  const suffix = withSuffix ? " ago" : "";

  if (years > 0) return `${years}y${suffix}`;
  if (months > 0) return `${months}mo${suffix}`;
  if (days > 0) return `${days}d${suffix}`;
  if (hours > 0) return `${hours}h${suffix}`;
  if (minutes > 0) return `${minutes}m${suffix}`;
  return "now";
}

export function convertHostInteractionPref(interactionPreference: string) {
  let modifiedPref = null;
  switch (interactionPreference) {
    case "I won't be available in person, and prefer communicating through the app.":
      modifiedPref = "not available";
      break;
    case "I like to say hello in person, but keep to myself otherwise.":
      modifiedPref = "say hello";
      break;
    case "I like socializing and spending time with guests.":
      modifiedPref = "socialize";
      break;
    case "No preferences - I follow my guests' lead.":
      modifiedPref = "no preference";
      break;

    case "not available":
      modifiedPref =
        "I won't be available in person, and prefer communicating through the app.";
      break;
    case "say hello":
      modifiedPref =
        "I like to say hello in person, but keep to myself otherwise.";
      break;
    case "socialize":
      modifiedPref = "I like socializing and spending time with guests.";
      break;
    case "no preference":
      modifiedPref = "No preferences - I follow my guests' lead.";
      break;
  }
  return modifiedPref;
}

const validationCache = new Map<string, boolean>(); // Module-level cache (optional)

export const validateImage = async (
  src: string,
  cache?: Map<string, boolean>,
): Promise<boolean> => {
  const currentCache = cache ?? validationCache;
  if (currentCache.has(src)) {
    return currentCache.get(src)!;
  }

  return new Promise((resolve) => {
    axios
      .head(src) // Use axios.head for HEAD request
      .then((response) => {
        const statusCode = response.status;
        const isValid = statusCode >= 200 && statusCode < 300;
        currentCache.set(src, isValid);
        resolve(isValid);
      })
      .catch((error) => {
        console.error("Image validation error for:", src, error);
        currentCache.set(src, false);
        resolve(false);
      });
  });
};

export function generateBookingUrl(propertyId: number): string {
  const today = new Date();

  // Calculate Check-In Date (5 days from today)
  const checkInDate = new Date(today);
  checkInDate.setDate(today.getDate() + 5);

  // Calculate Check-Out Date (5 days after Check-In, or 10 days from today)
  const checkOutDate = new Date(checkInDate);
  checkOutDate.setDate(checkInDate.getDate() + 5);

  // Function to format the date into "Month+Day,+Year" format
  const formatDate = (date: Date): string => {
    const monthNames = [
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
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}+${day}%2C+${year}`; // URL-encoded comma and space
  };

  const formattedCheckIn = formatDate(checkInDate);
  const formattedCheckOut = formatDate(checkOutDate);

  const url = `/request-to-book/${propertyId}?checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}&numGuests=2`;
  return url;
}
