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
    checkIn: optional(z.date()),
    checkOut: optional(z.date()),
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
      // roomType: z.enum([...ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER]).optional(),
      minNumBedrooms: z.number().optional(),
      minNumBeds: z.number().optional(),
      minNumBathrooms: z.number().optional(),
      airbnbLink: optional(zodUrl()),
      note: optional(zodString()),
    })
    .refine(({ date }) => date.from < date.to, {
      message: "Must stay for at least 1 night",
      path: ["date"],
    });

  export const multiCityRequestSchema = z.object({
    data: z.array(cityRequestSchema).min(1),
  });

  export type CityRequestDefaultVals = z.input<typeof cityRequestSchema>;
  export type MultiCityRequestVals = z.infer<typeof multiCityRequestSchema>;
  export type SearchBarVals = z.infer<typeof searchSchema>;