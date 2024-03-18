import { requestSelectSchema } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";

type PricesResponse = {
  price: {
    rate: number;
    currency: string;
    total: number;
  };
};

type APIResponse = {
  error: boolean;
  headers: any;
  results: PricesResponse[];
};

export const miscRouter = createTRPCRouter({
  getPriceEstimation: publicProcedure
    .input(
      requestSelectSchema.pick({
        location: true,
        checkIn: true,
        checkOut: true,
        numGuests: true,
      }),
    )
    .query(async ({ input }) => {
      return await fetch(
        `https://${env.RAPIDAPI_HOST}/search-location?${new URLSearchParams({
          location: input.location,
          checkin: input.checkIn.toString(),
          checkout: input.checkOut.toString(),
          adults: input.numGuests.toString(),
        })}`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": env.RAPIDAPI_HOST,
          },
        },
      )
        .then((res) => res.json())
        .then((res) => {});
    }),
});
