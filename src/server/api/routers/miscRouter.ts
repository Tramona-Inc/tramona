import { requestSelectSchema } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const priceEstimateSchema = z.object({
  price: z.object({
    rate: z.number(),
    currency: z.string(),
    total: z.number(),
  }),
});

export const miscRouter = createTRPCRouter({
  getMinAcceptablePrice: publicProcedure
    .input(
      requestSelectSchema.pick({
        location: true,
        checkIn: true,
        checkOut: true,
        numGuests: true,
      }),
    )
    .query(async ({ input }) => {
      return 100;

      const price = await fetch(
        `https://${env.RAPIDAPI_HOST}/search-location` +
          new URLSearchParams({
            location: input.location,
            checkin: input.checkIn.toString(),
            checkout: input.checkOut.toString(),
            adults: input.numGuests.toString(),
          }).toString(),
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": env.RAPIDAPI_HOST,
          },
        },
      )
        .then((res) => res.json())
        .then((res) => priceEstimateSchema.parse(res).price);

      if (price.currency !== "USD") {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // TODO: do some math to figure out the minimum acceptable price

      return price.total;
    }),
});
