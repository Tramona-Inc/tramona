import { ALL_REQUESTABLE_AMENITIES } from "@/server/db/schema";
import { optional, zodInteger, zodNumber, zodString } from "@/utils/zod-utils";
import { z } from "zod";
import type { CityRequestForm } from "./useCityRequestForm";
import type { LinkRequestForm } from "./useLinkRequestForm";
// import { ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER } from '@/server/db/schema';

export const searchSchema = z.object({
  location: optional(zodString()),
  date: z.object({ from: z.date(), to: z.date() }),
  numGuests: optional(zodInteger({ min: 1 })),
  maxNightlyPriceUSD: optional(zodNumber({ min: 0 })),
});

export const cityRequestSchema = z.object({
  location: zodString(),
  date: z.object({ from: z.date(), to: z.date() }),
  numGuests: zodInteger({ min: 1 }),
  maxNightlyPriceUSD: zodNumber({ min: 0 }),
  minNumBedrooms: z.number().optional(),
  minNumBeds: z.number().optional(),
  minNumBathrooms: z.number().optional(),
  amenities: z.enum(ALL_REQUESTABLE_AMENITIES).array(),
  note: optional(zodString().max(100)),
});

export const linkRequestSchema = z
  .object({
    date: z.object({ from: z.date(), to: z.date() }),
    numGuests: zodInteger({ min: 1 }),
    maxNightlyPriceUSD: zodNumber({ min: 0 }).optional(),
    minNumBedrooms: z.number().optional(),
    minNumBeds: z.number().optional(),
    minNumBathrooms: z.number().optional(),
    airbnbLink: z
      .string()
      .or(z.literal(""))
      .refine((url) => !url || url.startsWith("https://www.airbnb.com/rooms"), {
        message: 'URL must start with "https://www.airbnb.com/rooms"',
      }),
    note: optional(zodString()),
  })
  .superRefine((data, ctx) => {
    if (!data.numGuests) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Either provide an Airbnb link or fill out the location, date, number of guests, and maximum nightly price.",
        path: ["airbnbLink"], // specify the path to the field that is missing
      });
    } else if (data.date.from >= data.date.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must stay for at least 1 night",
        path: ["date"],
      });
    }
  });

export type CityRequestDefaultVals = z.input<typeof cityRequestSchema>;
export type LinkRequestVals = z.infer<typeof linkRequestSchema>;
export type SearchBarVals = z.infer<typeof searchSchema>;

export function isCityRequestForm(
  form: CityRequestForm | LinkRequestForm,
): form is CityRequestForm {
  return !("airbnbLink" in form);
}
