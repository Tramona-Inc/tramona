import { ALL_REQUESTABLE_AMENITIES } from "@/server/db/schema";
import {
  optional,
  zodInteger,
  zodNumber,
  zodString,
  zodUrl,
} from "@/utils/zod-utils";
import { z } from "zod";

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
  latLng: z.object({ lat: z.number(), lng: z.number() }),
  radius: z.number().optional(),
});

export const linkRequestSchema = z.object({
  url: zodUrl()
  // .startsWith("https://www.airbnb.com/rooms", {
  //   message: "URL must start with 'https://www.airbnb.com/rooms'",
  // }),
});

export type CityRequestDefaultVals = z.input<typeof cityRequestSchema>;
export type LinkRequestVals = z.infer<typeof linkRequestSchema>;
