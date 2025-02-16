import {
  ALL_LISTING_SITE_NAMES,
  ALL_PROPERTY_PMS,
  requestSelectSchema,
} from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";
import { format } from "date-fns";
import { TRPCError } from "@trpc/server";
import { zodUrl } from "@/utils/zod-utils";
import { getAddress, getCoordinates } from "@/server/google-maps";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { z } from "zod";
import {
  scrapeAirbnbInitialPageHelper,
  scrapeAirbnbPagesHelper,
  getPropertyOriginalPrice,
  urlScrape,
} from "@/server/server-utils";
import { scrapeAirbnbPrice } from "@/server/scrapePrice";
import { fetchPriceNoRateLimit } from "@/server/direct-sites-scraping/casamundo-scraper";

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

  scrapeAirbnbInitialPage: publicProcedure
    .input(
      z.object({
        checkIn: z.date(),
        checkOut: z.date(),
        location: z.string(),
        numGuests: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { checkIn, checkOut, location, numGuests } = input;
      return await scrapeAirbnbInitialPageHelper({
        checkIn,
        checkOut,
        location,
        numGuests,
      });
    }),

  scrapeAirbnbPages: publicProcedure
    .input(
      z.object({
        pageCursors: z.string().array(),
        checkIn: z.date(),
        checkOut: z.date(),
        location: z.string(),
        numGuests: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { checkIn, checkOut, location, numGuests, pageCursors } = input;
      return await scrapeAirbnbPagesHelper({
        checkIn,
        checkOut,
        location,
        numGuests,
        cursors: pageCursors,
      });
    }),

  getAverageHostPropertyPrice: publicProcedure
    .input(
      z.object({
        property: z.object({
          originalListingId: z.string().nullable(),
          originalListingPlatform: z
            .enum([...ALL_LISTING_SITE_NAMES, ...ALL_PROPERTY_PMS])
            .nullable(), //["Hospitable", "Hostaway"]
          hospitableListingId: z.string().nullable(),
        }),
        checkIn: z.string(),
        checkOut: z.string(),
        numGuests: z.number(),
      }),
    )
    .query(async ({ input: { property, checkIn, checkOut, numGuests } }) => {
      //This should only work for properties that are linked to hostinger
      if (!property.originalListingPlatform) throw new Error();

      const averagePrice = await getPropertyOriginalPrice(property, {
        checkIn,
        checkOut,
      });
      return averagePrice;
    }),

  scrapeAverageCasamundoPrice: publicProcedure
    .input(
      z.object({
        offerId: z.string(),
        checkIn: z.date(),
        numGuests: z.number(),
        duration: z.number(),
      }),
    )
    .query(async ({ input: { offerId, checkIn, numGuests, duration } }) => {
      const price = await fetchPriceNoRateLimit({
        offerId,
        checkIn,
        numGuests,
        duration,
      });

      if (price.status === "success") {
        return price.price / duration;
      }
      return price.status;
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
        urlScrape(url),
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

      const locationParts =
        coords && (await getAddress(coords).catch(() => undefined));

      const location = `${locationParts?.city}, ${locationParts?.stateCode}, ${locationParts?.country}`;

      if (!location) {
        return { status: "failed to extract city" } as const;
      }
      console.log(title, description, imageUrl, location, price);
      return {
        status: "success",
        data: { title, description, imageUrl, location, price },
      } as const;
    }),
});
