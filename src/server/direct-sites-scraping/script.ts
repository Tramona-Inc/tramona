import { formatZodError } from "@/utils/zod-utils";
import { z } from "zod";
import { casamundoScraper } from "./casamundo-scraper"
import { NewProperty, properties, propertyInsertSchema, reviews, reviewsInsertSchema } from "../db/schema";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { getCoordinates } from "../google-maps";
import { createLatLngGISPoint } from "../server-utils";
import { ScrapedListing } from ".";
import { evolveVacationRentalScraper } from "./evolve-scraper";


const filterNewPropertyFields = (listing: ScrapedListing): NewProperty => {
  const newPropertyKeys = Object.keys(properties).filter((key) => key !== "id");
  return Object.fromEntries(
    Object.entries(listing).filter(([key]) => newPropertyKeys.includes(key)),
  ) as unknown as NewProperty;
};

const scrapedListingSchema = propertyInsertSchema
  .omit({ latLngPoint: true })
  .extend({
    originalListingUrl: z.string(),
    reviews: reviewsInsertSchema.omit({ propertyId: true }).array(),
    scrapeUrl: z.string(),
    latLngPoint: z.object({ lat: z.number(), lng: z.number() }).optional(),
    nightlyPrice: z.number().optional(),
  });

type ScraperOptions = {
  location: string;
  checkIn: Date;
  checkOut: Date;
  requestNightlyPrice: number; // when the scraper is used by traveler request page
  requestId?: number; // when the scraper is used by traveler request page
  latitude?: number;
  longitude?: number;
  numGuests?: number;
};

export const handler = async (options: ScraperOptions) => {
  console.log("options", options);
  const scraperResults = await evolveVacationRentalScraper(options)
    .then((results) => {
      try {
        return scrapedListingSchema.array().parse(results);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Error parsing Casamundo:\n\n${formatZodError(error)}`);
        }
        throw error;
      }
    });
  return scraperResults;

  for (const result of scraperResults) {
    if (!result.originalListingId) {
      continue;
    }
    const existingOriginalPropertyId = await db.query.properties.findFirst({
      where: eq(properties.originalListingId, result.originalListingId),
    }).then((res) => res?.id);

    const { location } = await getCoordinates(result.address);
    let formattedlatLngPoint = null;
    if (result.latLngPoint) {
      formattedlatLngPoint = createLatLngGISPoint({
        lat: result.latLngPoint.lat,
        lng: result.latLngPoint.lng,
      });
    } else {
      if (!location)
        throw new Error("Could not get coordinates for address");
      formattedlatLngPoint = createLatLngGISPoint({
        lat: location.lat,
        lng: location.lng,
      });
    }

    const newPropertyListing = filterNewPropertyFields(result);
    if (existingOriginalPropertyId) {
      const tramonaProperty = await db
        .update(properties)
        .set({ ...newPropertyListing, latLngPoint: formattedlatLngPoint }) // Only keeps fields that are defined in the NewProperty schema
        .where(eq(properties.id, existingOriginalPropertyId))
        .returning({ id: properties.id });

      const tramonaPropertyId = tramonaProperty[0]!.id;

      if (result.reviews.length > 0) {
        await db
          .delete(reviews)
          .where(eq(reviews.propertyId, tramonaPropertyId));
        await db.insert(reviews).values(
          result.reviews.map((review) => ({
            ...review,
            propertyId: tramonaPropertyId,
          })),
        );
      }

    } else {
      const propertyId = await db
        .insert(properties)
        .values({
          ...newPropertyListing,
          latLngPoint: formattedlatLngPoint,
        })
        .returning()
        .then((res) => res[0]!.id);

      if (result.reviews.length > 0) {
        await db.insert(reviews).values(
          result.reviews.map((review) => ({
            ...review,
            propertyId,
          })),
        );
      }
    }
  }
}

const res = await handler({
  location: "North Carolina",
  checkIn: new Date("2025-05-21"),
  checkOut: new Date("2025-05-24"),
  requestNightlyPrice: 400,
  numGuests: 2,
});

console.log(res.length);
process.exit(0);