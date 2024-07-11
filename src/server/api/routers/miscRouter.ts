import { requestSelectSchema } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";
import { format } from "date-fns";
import { TRPCError } from "@trpc/server";
import puppeteer from "puppeteer";

import { z } from "zod";
import { zodString } from "@/utils/zod-utils";
import { sleep } from "@/utils/utils";
import { requestsRouter } from "./requestsRouter";

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
  scrapeUsingLink: publicProcedure
    .input(
      z.object({
        url: zodString({ maxLen: 1000 }),
      }),
    )
    .query(async ({ input }) => {
      const { url } = input;
      const searchParams = new URLSearchParams(url.split("?")[1]);

      try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });

        await sleep(2000);

        // const dialogExists = await page.$('[role="dialog"]');
        // if (dialogExists) {
        //   await page.mouse.click(1, 1); // Click on a point outside the popup (e.g., top-left corner)
        // }
        const dialogExists = await page.$(`[role=“dialog”]`);
        if (dialogExists) {
          // If popup appears, click outside of it to dismiss
          await page.mouse.click(10, 10); // Click on a point outside the popup
        }

        await sleep(1000);

        // Extract city name above the map with a longer timeout and error handling
        const cityName = await page.evaluate(() => {
          const citySection = document.querySelector(
            "#site-content > div > div:nth-child(1) > div:nth-child(5) > div > div > div > div:nth-child(2) > section",
          );
          const cityDiv = citySection?.querySelector("div:nth-child(2)"); // This targets the second child element within the section
          return cityDiv!.textContent!.trim();
        });

        await page.evaluate(() => {
          const xpathResult = document.evaluate(
            '//span[contains(text(), "Reserve")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
          );

          const firstNode = xpathResult.singleNodeValue;
          if (firstNode && firstNode instanceof HTMLElement) {
            firstNode.parentElement?.click();
          }
        });
        await sleep(5000);

        const priceItems = await page.evaluate(() => {
          const divsWithPriceItemTestIds = Array.from(
            document.querySelectorAll('div[data-testid^="price-item"]'),
          );
          const prices = divsWithPriceItemTestIds.map((div) => {
            const testId = div.getAttribute("data-testid");
            if (testId && testId.startsWith("price-item-ACCOMMODATION")) {
              const siblingDivs = Array.from(div.parentElement?.children ?? []);
              const siblingTextContents = siblingDivs.map((sibling) =>
                sibling.textContent?.trim(),
              );
              return siblingTextContents;
            } else {
              const span = div.querySelector("span");
              return span ? span.textContent?.trim() : null;
            }
          });
          return prices.flat().filter((price) => price !== null);
        });

        const imgSrcUrl = await page.evaluate(() => {
          const listingCardSection = document.querySelector(
            '[data-section-id="LISTING_CARD"]',
          );
          if (!listingCardSection) return null;

          const img = listingCardSection.querySelector("img");
          return img ? img.getAttribute("src") : null;
        });

        const listingCardTextContent = await page.evaluate(() => {
          const listingCardSection = document.querySelector(
            '[data-section-id="LISTING_CARD"]',
          );
          if (!listingCardSection) return [];

          const textContents = [];
          for (const child of listingCardSection.children) {
            textContents.push(child.textContent);
          }
          return textContents.filter(Boolean);
        });

        await browser.close();

        const totalPrice = Number(
          priceItems.slice(-1)[0]?.replace("$", "").replace(",", "").trim(),
        );
        const numDaysStr = priceItems[0]?.split(" ")[0]; // Get the number of nights
        const numDays = Number(numDaysStr);
        if (isNaN(numDays)) {
          throw new Error("Failed to extract number of days from price items");
        }
        const nightlyPrice = totalPrice / numDays;
        const propertyName =
          listingCardTextContent[0]?.substring(0, 255) ?? "Airbnb Property";
        const checkIn = new Date(searchParams.get("check_in")!);
        const checkOut = new Date(searchParams.get("check_out")!);
        const numGuests = Number(searchParams.get("adults"));

        const response = {
          cityName,
          nightlyPrice,
          propertyName,
          checkIn,
          checkOut,
          numGuests,
        };
        console.log(response);
        return response;
      } catch (error) {
        console.log(error);
        return new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error scraping the page",
        });
      }
    }),
});
