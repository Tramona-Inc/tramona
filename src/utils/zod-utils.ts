import { parseISO } from "date-fns";
import { z, type ZodType } from "zod";

/**
 * Zod wasn't meant for forms, so these utilities make it a lot less weird to write
 * validators for react-hook-form (e.g. trim input, parse empty strings as undefined,
 * minimum length of 1 by default)
 *
 * Example usage:
 * const schema = z.object({
 *  name: zodString({ minLen: 3, maxLen: 50 }),
 *  age: zodNumber({ min: 0, max: 120 }),
 *  birthday: optional(zodMMDDYYYY()),
 * });
 *
 */

/**
 * used for optional form fields (parses the empty string, whitespace, or `undefined` as `undefined`)
 */
export function optional<TZodType extends ZodType>(zodType: TZodType) {
  return zodType.optional().or(
    z
      .string()
      .trim()
      .pipe(z.literal("").transform(() => undefined)),
  );
}

export function zodString({ minLen = 0, maxLen = 255 } = {}) {
  return z
    .string()
    .trim()
    .min(1, { message: "Required" })
    .min(minLen, { message: `Must be ${minLen}+ characters` })
    .max(maxLen, { message: `Must be ${maxLen} characters or less` });
}

export function zodNumber({ min = -Infinity, max = Infinity } = {}) {
  return zodString()
    .transform((s) => +s)
    .refine((n) => !isNaN(n), { message: "Must be a number" })
    .refine((n) => n >= min && n <= max, {
      message:
        max === Infinity
          ? `Must be at least ${min}`
          : `Must be between ${min} and ${max}`,
    });
}

export function zodInteger({ min = -Infinity, max = Infinity } = {}) {
  return zodNumber({ min, max }).refine((n) => Number.isInteger(n), {
    message: "Must be an integer",
  });
}

export function zodUrl() {
  return zodString().url({ message: "Must be a valid URL" });
}

export function zodMMDDYYYY() {
  return zodString()
    .refine((s) => /^\d{2}\/\d{2}\/\d{4}$/.test(s), {
      message: "Must be in MM/DD/YYYY format",
    })
    .refine(
      (s) => {
        const [month, day, year] = s.split("/").map((s) => +s) as [
          number,
          number,
          number,
        ];
        const date = new Date(year, month - 1, day);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month - 1 &&
          date.getDate() === day
        );
      },
      { message: "Invalid date" },
    )
    .transform((s) => parseISO(s));
}
