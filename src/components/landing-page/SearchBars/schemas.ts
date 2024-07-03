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
  date: z.object({ from: z.date(), to: z.date() }).optional(),
  numGuests: optional(zodInteger({ min: 1 })),
  maxNightlyPriceUSD: optional(zodNumber({ min: 0 })),
});

export const defaultSearchOrReqValues: Partial<z.input<typeof searchSchema>> =
  {};

const cityRequestSchema = z
  .object({
    location: zodString().optional(),
    date: z.object({ from: z.date(), to: z.date() }).optional(),
    numGuests: zodInteger({ min: 1 }).optional(),
    maxNightlyPriceUSD: zodNumber({ min: 0 }).optional(),
    minNumBedrooms: z.number().optional(),
    minNumBeds: z.number().optional(),
    minNumBathrooms: z.number().optional(),
    airbnbLink: z
      .string()
      .url()
      .refine((url) => url.startsWith("https://www.airbnb.com/"), {
        message: 'URL must start with "https://www.airbnb.com/"',
      })
      .optional(),
    note: optional(zodString()),
  })
  .superRefine((data, ctx) => {
    if (!data.airbnbLink) {
      if (
        !data.location ||
        !data.date ||
        !data.numGuests ||
        !data.maxNightlyPriceUSD
      ) {
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

export const multiCityRequestSchema = z.object({
  data: z.array(cityRequestSchema).min(1),
});

export type CityRequestDefaultVals = z.input<typeof cityRequestSchema>;
export type MultiCityRequestVals = z.infer<typeof multiCityRequestSchema>;
export type SearchBarVals = z.infer<typeof searchSchema>;
