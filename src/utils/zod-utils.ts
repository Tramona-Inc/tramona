import { parseISO } from "date-fns";
import { z, type ZodType } from "zod";

/**
 * Zod wasn't meant for forms, so these utilities make it a lot less weird to write
 * validators for react-hook-form (e.g. trim input, parse empty strings as undefined,
 * minimum length of 1 by default)
 *
 * this is also a place for schemas/pipelines that youre reusing (e.g. zodPassword, zodEmail, zodMMDDYYYY)
 *
 * Example usage:
 * const schema = z.object({
 *  name: zodString({ minLen: 3, maxLen: 50 }),
 *  email: zodEmail(),
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
  return z
    .union([
      zodString()
        .transform((s) => +s)
        .refine((n) => !isNaN(n), { message: "Must be a number" }),
      z.number(),
    ])
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
  return zodString({ maxLen: Infinity }).url({
    message: "Must be a valid URL",
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

export function zodEmail() {
  return zodString()
    .email({ message: "Invalid email address" })
    .transform((s) => s.toLowerCase());
}

export function zodPassword() {
  return z
    .string()
    .min(8, { message: "Must be 8+ characters" })
    .max(32, { message: "Can't be longer than 32 characters" })
    .refine((value) => /[a-z]/.test(value), {
      message: "Must contain at least one lowercase letter",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Must contain at least one uppercase letter",
    })
    .refine((value) => /\d/.test(value), {
      message: "Must contain at least one digit",
    })
    .refine((value) => /[!@#$%^&*]/.test(value), {
      message: "Must contain at least one special character '!@#$%^&*'",
    });
}

export function zodPhone() {
  return z.string().refine(
    (value) => {
      // Remove non-digit characters and check if the length is 10 or 11
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length === 10 || digitsOnly.length === 11;
    },
    {
      message: "Invalid phone number format",
    },
  );
}

export const zodTime = z
  .string()
  .regex(
    /^(?:(?:[01]\d|2[0-3]):([0-5]\d))|(?:(0?[1-9]|1[0-2]):([0-5]\d)\s?(?:AM|PM))$/i,
    "Invalid time format",
  );

export function formatZodError(error: z.ZodError<unknown>) {
  return JSON.stringify(
    error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
    null,
    2,
  );
}
