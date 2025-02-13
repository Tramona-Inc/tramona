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
import nodeFetch from "node-fetch";
import { parser } from "stream-json"; // Example from stream-json
import { optional } from "../../../utils/zod-utils";

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
        numGuests,
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

  makeOllamaCall: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        requestedLocationLatLng: z
          .object({ lat: z.number(), lng: z.number() })
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!input.requestedLocationLatLng) return;
      let fullResponseText = "";
      let thinkContent = ""; // Variable to store content from <think> tags
      try {
        console.log(input);
        // --- 1. Call Ollama API ---
        const ollamaResponse = await fetch(
          "http://localhost:11434/api/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "DeepSeek-r1",
              prompt: getPromptWithLatLngValues(
                input.requestedLocationLatLng.lat,
                input.requestedLocationLatLng.lng,
              ),
            }),
          },
        );

        if (!ollamaResponse.ok) {
          console.error(
            "Ollama API Error:",
            ollamaResponse.status,
            ollamaResponse.statusText,
          );
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error calling Ollama API",
            cause: `Ollama API responded with status ${ollamaResponse.status} ${ollamaResponse.statusText}`,
          });
        }

        // --- 2. Process ReadableStream ---
        if (ollamaResponse.body) {
          const reader = ollamaResponse.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            if (value) {
              const textChunk = decoder.decode(value);
              let validJsonChunkString = textChunk; // Assume the whole chunk is valid JSON initially

              try {
                // --- Attempt to Parse only the Valid JSON part ---
                // Find the last closing curly brace '}' - this is a heuristic to isolate JSON
                const lastBraceIndex = textChunk.lastIndexOf("}");
                if (lastBraceIndex !== -1) {
                  validJsonChunkString = textChunk.substring(
                    0,
                    lastBraceIndex + 1,
                  ); // Extract substring up to the last '}'
                }
                const jsonChunk = JSON.parse(validJsonChunkString); // Parse the isolated JSON string

                if (jsonChunk.response) {
                  fullResponseText += jsonChunk.response;
                }
              } catch (jsonParseError) {
                console.error(
                  "Error parsing JSON chunk:",
                  jsonParseError,
                  "Chunk Text:",
                  textChunk,
                  "Attempted JSON parse on:",
                  validJsonChunkString, // Log the string we attempted to parse
                );
                // Consider: Instead of throwing error, maybe just skip this chunk or handle differently
                // For now, we will still throw TRPCError to signal a problem
              }
            }
          }
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Ollama response body is empty",
            cause: "ReadableStream body was expected but not received.",
          });
        }

        // --- 3. Extract <think> content and clean fullResponseText ---
        const thinkTagRegex = /<think>(.*?)<\/think>/gs;
        let match;
        while ((match = thinkTagRegex.exec(fullResponseText)) !== null) {
          thinkContent += match[1].trim() + "\n";
        }
        const cleanedResponseText = fullResponseText
          .replace(thinkTagRegex, "")
          .trim();

        // --- 4. Parse cleanedResponseText as JSON object array ---
        let suggestedNeighborhoods: {
          city: string;
          state: string | null;
          postcode: string | null;
        }[] = [];
        try {
          suggestedNeighborhoods = JSON.parse(cleanedResponseText); // Parse directly as JSON
          if (!Array.isArray(suggestedNeighborhoods)) {
            throw new Error("Ollama response is not a JSON array as expected.");
          }
        } catch (fullJsonParseError) {
          console.error(
            "Error parsing full JSON response:",
            fullJsonParseError,
            "Response Text:",
            cleanedResponseText,
          );
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error parsing JSON response from Ollama",
            cause: fullJsonParseError,
          });
        }

        if (!suggestedNeighborhoods || suggestedNeighborhoods.length === 0) {
          console.log("Ollama did not return any neighborhoods in the stream.");
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Could not determine neighborhoods from location from stream.",
            cause:
              "Ollama AI model stream did not contain a valid neighborhood list.",
          });
        }
        console.log("Parsed suggestedNeighborhoods:", suggestedNeighborhoods);

        return {
          suggestedNeighborhoods: suggestedNeighborhoods, // Clean array of neighborhoods
          think: thinkContent.trim(), // Return accumulated think content as a string
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          console.error("Unexpected API Route Error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
            cause: error,
          });
        }
      }
    }),
});

function getPromptWithLatLngValues(latitude: number, longitude: number) {
  return `For the geographic location with coordinates: Latitude ${latitude}, Longitude ${longitude}, provide a list of **major and ALL RELEVANT neighborhoods or sections** within the city at these coordinates, and immediately bordering cities. Focus **STRICTLY** on areas that are **within a 10-mile radius, ABSOLUTELY MAXIMUM** from these coordinates.

If the given location is already a neighborhood, then list **major and ALL RELEVANT nearby neighborhoods** within the same city and immediately adjacent cities, again **STRICTLY** within a **10-mile radius, ABSOLUTELY MAXIMUM** of these coordinates.

Return your response as a **pure JSON array of objects** (and nothing else). Each object in the array should represent a neighborhood and have the following keys:

*   **city**: The name of the neighborhood or section (String).
*   **state**: The state abbreviation (String, Optional - can be null if state is not clearly known).
*   **postcode**: The zip code or postal code (String, Optional - can be null if postcode is not easily available).

**Example JSON Output Format (Array of Objects):**

\`\`\`json
[
  {
    "city": "Hollywood",
    "state": "CA",
    "postcode": "90028"
  },
  {
    "city": "Downtown Los Angeles",
    "state": "CA",
    "postcode": "90013"
  },
  {
    "city": "Santa Monica",
    "state": "CA",
    "postcode": "90401"
  },
  // ... and many more neighborhoods in Los Angeles ...
]
\`\`\`

Do not include any introductory phrases, explanations, or extra text outside of the JSON array. Just the JSON array.

For large cities, **aim to provide a comprehensive list of at least 20-25 major neighborhoods or sections**. For medium-sized cities, aim for at least 10-15. For small cities, try to get at least 5. If it's an isolated town and there are very few neighborhoods truly within a 10-mile radius, listing fewer is acceptable if no closer neighborhoods are genuinely available within that strict radius.

**STRICTLY AVOID suggesting areas outside of a 10-mile radius from these Latitude and Longitude coordinates, such as areas significantly further away from the city center.**`;
}
