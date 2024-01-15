import { parseISO } from "date-fns";
import { type ZodType, z } from "zod";

/**
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

export function zodString({ minLen = -Infinity, maxLen = Infinity } = {}) {
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
