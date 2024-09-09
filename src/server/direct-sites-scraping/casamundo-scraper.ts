import { DirectSiteScraper, SubsequentScraper, ScrapedListing } from "@/server/direct-sites-scraping";
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
    icons: z.array(z.object({
      label: z.string(),
      icon: z.string(),
    })),
  }),
  bedrooms: z.number().nullable(),
  bathrooms: z.number().nullable(),
  geoLocation: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  id: z.string(),
  images: z.array(z.object({
    large: z.string(),
  })),
  name: z.string(),
  persons: z.number(),
  price: z.object({
    totalRaw: z.number(),
    perNight: z.string(),
  }),
  ratings: z.object({
    reviewCount: z.number(),
    starValue: z.string(),
  }).nullable(),
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
  scrapeUrl: string
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
    originalListingUrl: `https://www.casamundo.com${offer.actions.conversion.fifth.link}`,
    avgRating: offer.ratings ? parseFloat(offer.ratings.starValue) : 0,
    numRatings: offer.ratings ? offer.ratings.reviewCount : 0,
    originalListingPlatform: "Casamundo" as ListingSiteName,
    originalNightlyPrice: Math.round(parseFloat(offer.price.perNight.replace('$', '')) * 100),
    reviews: [],
    scrapeUrl: scrapeUrl,
  };
};

async function getLocationId(location: string): Promise<string> {
    const autocompleteUrl = "https://www.casamundo.com/api/v2/autocomplete";
    const params = new URLSearchParams({
      q: location,
      limit: "1",
    });
  
    try {
      const response = await axios.get(`${autocompleteUrl}?${params.toString()}`);
      const suggestions = response.data.suggestions;
  
      if (suggestions.length > 0) {
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
  
    try {
      const locationId = await getLocationId(location);
      console.log("Location ID:", locationId);
      
      const url = `https://www.casamundo.com/searchdetails/${locationId}`;
      const params = new URLSearchParams({
        fieldTreeId: "SearchDetailsFields.SERP",
        searchId: "7f7edac54fd02f17", // This might need to be dynamically generated
        adults: "2",
        arrival: checkIn.toISOString().split('T')[0],
        duration: getNumNights(checkIn, checkOut).toString(),
      });
  
      // The rest of the function remains the same...
      const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryk1VTs0O1L7iXSYwG',
      };
  
      const formData = `------WebKitFormBoundaryk1VTs0O1L7iXSYwG\r\nContent-Disposition: form-data; name="offers"\r\n\r\n9789b97d00a53296,41dfcd564c57ac7e,eccc47dfde763666,30bf75b3998fe182,00fd3be065ef18e2,e413bad5e4a8b313,3a58a0906d82e6c4\r\n------WebKitFormBoundaryk1VTs0O1L7iXSYwG--\r\n`;
  
      const response = await axios.post(`${url}?${params.toString()}`, formData, { headers });
      console.log("Casamundo response:", response.data);
      const offers = response.data.offers;
      console.log("Casamundo offers:", offers);
      const parsedOffers = offers.slice(0, numOfOffersInEachScraper).map((offer: any) => offerSchema.parse(offer));
  
      return parsedOffers.map(offer => 
        mapToScrapedListing(offer, checkIn, checkOut, url)
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