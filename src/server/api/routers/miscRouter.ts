import { requestSelectSchema } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";
import { format } from "date-fns";
import { TRPCError } from "@trpc/server";
import { zodUrl } from "@/utils/zod-utils";
import { getCity, getCoordinates } from "@/server/google-maps";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { z } from "zod";
import { scrapeUrl } from "@/server/server-utils";
import { scrapeAirbnbPrice } from "@/server/scrapePrice";
import { cleanbnbScraper } from "@/server/direct-sites-scraping/cleanbnb-scrape";

type AirbnbListing = {
  id: string;
  url: string;
  deeplink: string;
  position: number;
  name: string;
  bathrooms: number;
  bedrooms: number;
  beds: number;
  city: string;
  images: unknown[];
  hostThumbnail: string;
  isSuperhost: boolean;
  rareFind: boolean;
  lat: number;
  lng: number;
  persons: number;
  reviewsCount: number;
  type: string;
  userId: number;
  address: string;
  amenityIds: unknown[];
  previewAmenities: unknown[];
  cancelPolicy: string;
  price: {
    rate: number;
    currency: string;
    total: number;
  };
};

type ApiResponse = {
  error: boolean;
  headers: unknown;
  results: AirbnbListing[];
};

export const miscRouter = createTRPCRouter({
  getAverageNightlyPrice: publicProcedure
    .input(
      requestSelectSchema.pick({
        location: true,
        checkIn: true,
        checkOut: true,
        numGuests: true,
      }),
    )
    .query(async ({ input }) => {
      const price = (await fetch(
        `https://${env.RAPIDAPI_HOST}/search-location?` +
        new URLSearchParams({
          location: input.location,
          checkin: format(input.checkIn, "yyyy-MM-dd"),
          checkout: format(input.checkOut, "yyyy-MM-dd"),
          adults: input.numGuests.toString(),
        }).toString(),
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": env.RAPIDAPI_HOST,
          },
        },
      ).then((res) => res.json())) as ApiResponse;

      if (price.error) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      // Calculate average nightly price
      const averageNightlyPrice =
        Array.isArray(price.results) && price.results.length > 0
          ? price.results.reduce((acc, listing) => {
            return acc + listing.price.rate;
          }, 0) / price.results.length
          : 0;

      return averageNightlyPrice;
    }),

  scrapeCleanbnbLink: publicProcedure
    .input(z.object({ checkIn: z.string().optional(), checkOut: z.string().optional() }))
    .mutation(async ({input}) => {
      if (input.checkIn && input.checkOut) {
        const res = await cleanbnbScraper({ checkIn: new Date(input.checkIn), checkOut: new Date(input.checkOut) });
        return res;
      }
    }),

  scrapeAirbnbLink: publicProcedure
    .input(
      z.object({
        url: zodUrl(),
        params: z.object({
          checkIn: z.string(),
          checkOut: z.string(),
          numGuests: z.number(),
        }),
      }),
    )
    .query(async ({ input: { url, params } }) => {
      const airbnbListingId = Airbnb.parseId(url);
      if (!airbnbListingId) return { status: "failed to parse url" } as const;

      const [$, price] = await Promise.all([
        scrapeUrl(url),
        scrapeAirbnbPrice({ airbnbListingId, params }),
      ]);

      // title is swapped with description because the og:description is actually the property title,
      // and the og:title is more like a description
      const title = $('meta[property="og:description"]').attr("content");
      const description = $('meta[property="og:title"]').attr("content");
      const imageUrl = $('meta[property="og:image"]').attr("content");

      const pageTitle = $("title").text();

      if (!title || !description || !imageUrl || !pageTitle) {
        return { status: "failed to scrape" } as const;
      }

      // refactor to use regex
      const cityName = pageTitle.match(/for Rent in (.*?) - Airbnb/)?.[1];

      console.log(cityName);

      if (!cityName) {
        return { status: "failed to parse title" } as const;
      }

      const coords = await getCoordinates(cityName).then((res) => res.location);

      const location = coords && (await getCity(coords).catch(() => undefined));

      if (!location) {
        return { status: "failed to extract city" } as const;
      }

      return {
        status: "success",
        data: { title, description, imageUrl, location, price },
      } as const;
    }),
});
