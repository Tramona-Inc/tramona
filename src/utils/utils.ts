import { REFERRAL_CODE_LENGTH } from '@/server/db/schema';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isSameMonth, isSameYear } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateReferralCode() {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';

  for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export async function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

/**
 * Examples:
 * ```js
 * plural(1, 'apple') => '1 apple'
 * plural(2, 'apple') => '2 apples'
 * plural(2, 'octopus', 'octopi') => '2 octopi'
 * ```
 */
export function plural(count: number, noun: string, pluralNoun?: string) {
  if (count === 1) return `1 ${noun}`;
  return `${count} ${pluralNoun ? pluralNoun : noun + 's'}`;
}

/**
 * Example outputs:
 * ```js
 * 'Jan 1, 2021'
 * 'Jan 1 – 2, 2021'
 * 'Jan 1 – Feb 2, 2021'
 * 'Jan 1, 2021 – Feb 2, 2022'
 * ```
 */
export function formatDateRange({ from, to }: { from: Date; to?: Date }) {
  if (!to) {
    return format(from, 'MMM d, yyyy');
  }

  const sameMonth = isSameMonth(from, to);
  const sameYear = isSameYear(from, to);

  if (sameMonth && sameYear) {
    return `${format(from, 'MMM d')} – ${format(to, 'd, yyyy')}`;
  }
  if (sameYear) {
    return `${format(from, 'MMM d')} – ${format(to, 'MMM d, yyyy')}`;
  }
  return `${format(from, 'MMM d, yyyy')} – ${format(to, 'MMM d, yyyy')}`;
}

export function formatDateRangeFromStrs({ from, to }: { from: string; to?: string }) {
  const fromDate = new Date(from + 'T00:00:00');
  const toDate = to ? new Date(to + 'T00:00:00') : undefined;

  return formatDateRange({ from: fromDate, to: toDate });
}

export function formatArrayToString(arr: string[]) {
  if (arr.length === 0) {
    return '';
  } else if (arr.length === 1) {
    return arr[0]!;
  } else if (arr.length === 2) {
    return `${arr[0]} and ${arr[1]}`;
  } else {
    const lastItem = arr.pop();
    const joinedItems = arr.join(', ');
    return `${joinedItems}, and ${lastItem}`;
  }
}

// Example usage:
const inputArray = ['one', 'two', 'three'];
const formattedString = formatArrayToString(inputArray);
console.log(formattedString);
