import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { requestSelectSchema } from "@/server/db/schema";
import {
  createTRPCRouter,
  publicProcedure,
  roleRestrictedProcedure,
} from "../trpc";
import { env } from "@/env";
import { format } from "date-fns";
import { TRPCError } from "@trpc/server";
import { zodUrl } from "@/utils/zod-utils";
import * as cheerio from "cheerio";
import { getCity, getCoordinates } from "@/server/google-maps";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { z } from "zod";

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

      const [res, price] = await Promise.all([
        axios.get<string>(url, {
          httpsAgent: new HttpsProxyAgent(env.PROXY_URL),
          responseType: "text",
        }),
        await Airbnb.createListing(airbnbListingId).getPrice(params),
      ]);

      if (res.status === 404) return { status: "not found" } as const;
      if (res.status !== 200) {
        console.log("status:", res.status);
        console.log("\n\nwhole response:", res);
        return { status: "failed to fetch" } as const;
      }

      const html = res.data;
      const $ = cheerio.load(html);
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

  proxyFetch: roleRestrictedProcedure(["admin"])
    .input(z.object({ url: zodUrl() }))
    .query(async ({ input: { url } }) => {
      const res = await axios.get<string>(url, {
        httpsAgent: new HttpsProxyAgent(env.PROXY_URL),
        responseType: "text",
      });

      return {
        status: res.status,
        data: res.data,
      };
    }),
});
