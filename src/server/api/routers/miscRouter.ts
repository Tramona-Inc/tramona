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
        url: zodString({ maxLen: 500 }),
      }),
    )
    .query(async ({ input }) => {
      const { url } = input;
      const searchParams = new URLSearchParams(url.split("?")[1]);

      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage(); // Type assertion
        await page.goto(url, { waitUntil: "domcontentloaded" });

        await sleep(2000);

        const dialogExists = await page.$('[role="dialog"]');
        if (dialogExists) {
          // If popup appears, click outside of it to dismiss
          await page.mouse.click(1, 1); // Click on a point outside the popup (e.g., top-left corner)
        }

        await sleep(500);

        await page.evaluate(() => {
          const xpathResult = document.evaluate(
            '//span[contains(text(), "Reserve")]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
          );

          // Click reserve
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

        const nightlyPrice = Number(
          priceItems[0]?.split(" ")[0]?.replace("$", "").trim(),
        );
        const propertyName =
          listingCardTextContent[0]?.substring(0, 255) ?? "Airbnb Property";
        const checkIn = new Date(searchParams.get("check_in")!);
        const checkOut = new Date(searchParams.get("check_out")!);
        const numGuests = Number(searchParams.get("adults"));

        const response = {
          nightlyPrice,
          propertyName,
          checkIn,
          checkOut,
          numGuests,
        };

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
