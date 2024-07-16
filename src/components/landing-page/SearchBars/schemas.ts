import {
  optional,
  zodInteger,
  zodNumber,
  zodString,
  zodUrl,
} from "@/utils/zod-utils";
import { z } from "zod";
// import { ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER } from '@/server/db/schema';

export const searchSchema = z.object({
  location: optional(zodString()),
  date: z.object({ from: z.date(), to: z.date() }),
  numGuests: optional(zodInteger({ min: 1 })),
  maxNightlyPriceUSD: optional(zodNumber({ min: 0 })),
});

export const defaultSearchOrReqValues: Partial<z.input<typeof searchSchema>> =
  {};

const cityRequestSchema = z
  .object({
    location: zodString(),
    date: z.object({ from: z.date(), to: z.date() }),
    numGuests: zodInteger({ min: 1 }),
    maxNightlyPriceUSD: zodNumber({ min: 0 }),
    minNumBedrooms: z.number().optional(),
    minNumBeds: z.number().optional(),
    minNumBathrooms: z.number().optional(),
    airbnbLink: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((url) => !url || url.startsWith("https://www.airbnb.com/rooms"), {
        message: 'URL must start with "https://www.airbnb.com/rooms"',
      }),
    note: optional(zodString()),
  })
  .superRefine((data, ctx) => {
    if (!data.airbnbLink) {
      if (!data.location || !data.numGuests || !data.maxNightlyPriceUSD) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Either provide an Airbnb link or fill out the location, date, number of guests, and maximum nightly price.",
          path: ["airbnbLink"], // specify the path to the field that is missing
        });
      } else if (data.date && data.date.from >= data.date.to) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must stay for at least 1 night",
          path: ["date"],
        });
      }
    }
  });

const linkRequestSchema = z
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
    if (!data.airbnbLink) {
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
    }
  });

export const multiCityRequestSchema = z.object({
  data: z.array(cityRequestSchema).min(1),
});
export const multiLinkRequestSchema = z.object({
  data: z.array(linkRequestSchema).min(1),
});

export type CityRequestDefaultVals = z.input<typeof cityRequestSchema>;
export type MultiCityRequestVals = z.infer<typeof multiCityRequestSchema>;
export type MultiLinkRequestVals = z.infer<typeof multiLinkRequestSchema>;
export type SearchBarVals = z.infer<typeof searchSchema>;
