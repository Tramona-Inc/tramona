import {
  DirectSiteScraper,
  SubsequentScraper,
  ScrapedListing,
} from "@/server/direct-sites-scraping";
import { Review } from "@/server/db/schema";
import axios from "axios";
import { z } from "zod";
import { PropertyType } from "@/server/db/schema/common";
import { ListingSiteName } from "@/server/db/schema/common";
import { getNumNights } from "@/utils/utils";
import { getCoordinates } from "../google-maps";

const offerSchema = z.object({
  SavePercentPrice: z.any().nullable(),
  actions: z.object({
    conversion: z.object({
      fifth: z.object({
        link: z.string(),
      }),
    }),
  }),
  amenities: z.object({
    icons: z.array(
      z.object({
        label: z.string(),
        icon: z.string(),
      }),
    ),
  }),
  bedrooms: z.number().nullable(),
  bathrooms: z.number().nullable(),
  geoLocation: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  id: z.string(),
  images: z.array(
    z.object({
      large: z.string(),
    }),
  ),
  name: z.string(),
  persons: z.number(),
  price: z.object({
    totalRaw: z.number(),
    perNight: z.string(),
  }),
  ratings: z
    .object({
      reviewCount: z.number(),
      starValue: z.string(),
    })
    .nullable(),
  type: z.string(),
});

type CasamundoOffer = z.infer<typeof offerSchema>;

const mapPropertyType = (type: string): PropertyType => {
  switch (type.toLowerCase()) {
    case "house":
      return "House";
    case "accommodation":
      return "Other";
    default:
      return "Other";
  }
};

const mapToScrapedListing = (
  offer: CasamundoOffer,
  checkIn: Date,
  checkOut: Date,
  propertyUrl: string
): ScrapedListing => {
  return {
    originalListingId: offer.id,
    name: offer.name,
    propertyType: mapPropertyType(offer.type),
    latitude: offer.geoLocation.lat,
    longitude: offer.geoLocation.lon,
    maxNumGuests: offer.persons,
    numBeds: offer.bedrooms || 1,
    numBedrooms: offer.bedrooms || 1,
    numBathrooms: offer.bathrooms || 1,
    amenities: offer.amenities.icons.map(icon => icon.label),
    imageUrls: offer.images.map(img => img.large),
    originalListingUrl: propertyUrl,
    avgRating: offer.ratings ? parseFloat(offer.ratings.starValue) : 0,
    numRatings: offer.ratings ? offer.ratings.reviewCount : 0,
    originalListingPlatform: "Casamundo" as ListingSiteName,
    originalNightlyPrice: Math.round(parseFloat(offer.price.perNight.replace('$', '')) * 100),
    reviews: [],
    scrapeUrl: propertyUrl,
  };
};

async function getLocationId(location: string): Promise<string> {
  const autocompleteUrl = "https://www.casamundo.com/api/v2/autocomplete";
  const params = new URLSearchParams({
    q: location,
    limit: "10",
  });

  try {
    const response = await axios.get(`${autocompleteUrl}?${params.toString()}`);
    const suggestions = response.data.suggestions;
    console.log("Casamundo location suggestions:", suggestions);

    if (suggestions.length > 0) {
      // Split the input location into parts
      const locationParts = location
        .toLowerCase()
        .split(",")
        .map((part) => part.trim());

      // Function to score a suggestion based on how well it matches the input
      const scoreMatch = (suggestion) => {
        const fullTitle = suggestion.fullTitle.toLowerCase();
        const trail = suggestion.trail.toLowerCase();
        let score = 0;

        // Exact match for full title gets highest score
        if (fullTitle === locationParts[0]) {
          score += 100;
        } else if (fullTitle.includes(locationParts[0])) {
          score += 50;
        }

        // Check if all parts of the input location are present in either the fullTitle or trail
        if (
          locationParts.every(
            (part) => fullTitle.includes(part) || trail.includes(part),
          )
        ) {
          score += 25;
        }

        // Penalize for additional words in the title (to prefer general over specific)
        score -= fullTitle.split(" ").length;

        return score;
      };

      // Find the suggestion with the highest score
      const bestMatch = suggestions.reduce(
        (best, current) => {
          const currentScore = scoreMatch(current);
          return currentScore > best.score
            ? { suggestion: current, score: currentScore }
            : best;
        },
        { suggestion: null, score: -Infinity },
      ).suggestion;

      if (bestMatch) {
        console.log("Found best match:", bestMatch);
        return bestMatch.id;
      }

      // If no best match, use the first suggestion
      console.log("Using first suggestion:", suggestions[0]);
      return suggestions[0].id;
    } else {
      throw new Error("No location found");
    }
  } catch (error) {
    console.error("Error fetching location ID:", error);
    throw error;
  }
}

export const casamundoScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  numOfOffersInEachScraper = 5,
  requestNightlyPrice,
  requestId,
  scrapersToExecute,
  location,
}) => {
  if (!location) {
    throw new Error("Location must be provided for Casamundo scraper");
  }

// AFTER GETTING THE LOCATION IDS, EITHER SCRAPE THE HTML OFF EACH PAGE OR CHECK OUT THE SERVER NETWORK TAB TO SEE IF THERE IS AN API CALL THAT CAN BE MADE

  try {
    console.log(`Searching for location: ${location}`);
    const locationId = await getLocationId(location);
    console.log("Location ID:", locationId);
    
    const searchUrl = `https://www.casamundo.com/searchdetails/${locationId}`;
    const params = new URLSearchParams({
      fieldTreeId: "SearchDetailsFields.SERP",
      adults: "2",
      arrival: checkIn.toISOString().split('T')[0],
      duration: getNumNights(checkIn, checkOut).toString(),
    });

    console.log("Making request to URL:", `${searchUrl}?${params.toString()}`);

    const headers = {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
    };

    const response = await axios.post(`${searchUrl}?${params.toString()}`, {}, { headers });
    console.log("Casamundo response status:", response.status);
    console.log("Casamundo response data keys:", Object.keys(response.data));
    
    const offers = response.data.offers || [];
    console.log("Number of offers:", offers.length);
    
    const offerIds: string[] = offers.map((offer) => offer.id);
    console.log("Extracted offer IDs:", offerIds);

    // Generate property URLs
    const propertyUrls = offerIds.slice(0, numOfOffersInEachScraper).map(offerId => {
      const propertyParams = new URLSearchParams({
        adults: "2",
        arrival: checkIn.toISOString().split('T')[0],
        duration: getNumNights(checkIn, checkOut).toString(),
        location: locationId,
        persons: "2",
        pricetype: "perNight",
        searchId: requestId || "",  // You might want to generate a unique searchId
      });
      return `https://www.casamundo.com/rental/${offerId}?${propertyParams.toString()}`;
    });

    console.log("Generated property URLs:", propertyUrls);

    const parsedOffers = offers.slice(0, numOfOffersInEachScraper).map((offer: any) => offerSchema.parse(offer));

    return parsedOffers.map((offer, index) => 
      mapToScrapedListing(offer, checkIn, checkOut, propertyUrls[index])
    );
  } catch (error) {
    console.error("Error scraping Casamundo:", error);
    return [];
  }
};

export const casamundoSubScraper: SubsequentScraper = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
}) => {
  // Implementation for subsequent scraping
  // This would be similar to the main scraper, but focusing on a single listing
  // You'll need to implement this based on how Casamundo's API handles individual property requests
  return {
    isAvailableOnOriginalSite: false,
    availabilityCheckedAt: new Date(),
  };
};
