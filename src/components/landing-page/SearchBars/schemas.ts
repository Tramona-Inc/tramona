import { z } from "zod";
import { optional, zodInteger, zodString } from "@/utils/zod-utils";
import { ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER } from "@/server/db/schema";

export const searchSchema = z.object({
  location: zodString(),
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  numGuests: zodInteger({ min: 1 }),
  maxNightlyPriceUSD: zodInteger({ min: 1 }),
  roomType: z.enum([...ALL_PROPERTY_ROOM_TYPES_WITHOUT_OTHER]).optional(),
  minNumBedrooms: z.number().transform((n) => (n <= 1 ? undefined : n)),
  minNumBeds: z.number().transform((n) => (n <= 1 ? undefined : n)),
  minNumBathrooms: z.number().transform((n) => (n <= 1 ? undefined : n)),
});

export const defaultSearchOrReqValues: Partial<z.input<typeof searchSchema>> = {
  minNumBathrooms: 1,
  minNumBeds: 1,
  minNumBedrooms: 1,
};

const cityRequestSchema = searchSchema
  .extend({
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
