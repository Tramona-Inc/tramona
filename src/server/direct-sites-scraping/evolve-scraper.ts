import axios from 'axios';
import * as cheerio from 'cheerio';
import { z } from 'zod';
import { DirectSiteScraper, SubsequentScraper, ScrapedListing } from "@/server/direct-sites-scraping";
import { Review, PropertyType } from "@/server/db/schema";
import { ListingSiteName } from "@/server/db/schema/common";
import { getNumNights } from "@/utils/utils";

const EvolvePropertySchema = z.object({
  id: z.string(),
  name: z.string(),
  bedrooms: z.number(),
  bathrooms: z.number(),
  maxOccupancy: z.number(),
  propertyType: z.string(),
  amenities: z.array(z.string()),
  imageUrls: z.array(z.string()),
  latitude: z.number(),
  longitude: z.number(),
  averageRating: z.number().optional(),
  reviewCount: z.number().optional(),
  price: z.number(),
});

type EvolveProperty = z.infer<typeof EvolvePropertySchema>;

const mapPropertyType = (scrapedType: string): PropertyType => {
  const typeMap: Record<string, PropertyType> = {
    House: "House",
    Condo: "Condominium",
    Cabin: "Cabin",
    Townhome: "Townhouse",
    Apartment: "Apartment",
    Cottage: "Cottage",
    Studio: "Studio",
    Villa: "Villa",
  };
  return typeMap[scrapedType] || "Other";
};

const fetchEvolveData = async (url: string): Promise<EvolveProperty[]> => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);
  const scriptContent = $('#__NEXT_DATA__').html();
  if (!scriptContent) throw new Error('Could not find script content');
  
  const jsonData = JSON.parse(scriptContent);
  const properties = jsonData.props.pageProps.searchResults.results;

  return properties.map((prop: any) => EvolvePropertySchema.parse({
    id: prop.id,
    name: prop.name,
    bedrooms: prop.bedrooms,
    bathrooms: prop.bathrooms,
    maxOccupancy: prop.maxOccupancy,
    propertyType: prop.propertyType,
    amenities: prop.amenities,
    imageUrls: prop.images.map((img: any) => img.url),
    latitude: prop.latitude,
    longitude: prop.longitude,
    averageRating: prop.averageRating,
    reviewCount: prop.reviewCount,
    price: prop.pricing.total,
  }));
};

const mapToScrapedListing = (prop: EvolveProperty, scrapeUrl: string): ScrapedListing => ({
  originalListingId: prop.id,
  name: prop.name,
  about: "", // Evolve doesn't provide a description in the search results
  propertyType: mapPropertyType(prop.propertyType),
  address: "", // Address not provided in search results
  city: "", // City not provided in search results
  latitude: prop.latitude,
  longitude: prop.longitude,
  maxNumGuests: prop.maxOccupancy,
  numBeds: prop.bedrooms, // Assuming number of bedrooms equals number of beds
  numBedrooms: prop.bedrooms,
  numBathrooms: prop.bathrooms,
  amenities: prop.amenities,
  otherAmenities: [],
  imageUrls: prop.imageUrls,
  originalListingUrl: `https://evolve.com/vacation-rentals/${prop.id}`,
  avgRating: prop.averageRating || 0,
  numRatings: prop.reviewCount || 0,
  originalListingPlatform: "Evolve Vacation Rental" as ListingSiteName,
  originalNightlyPrice: Math.round(prop.price / getNumNights(new Date(), new Date())), // This is not accurate, we need actual check-in and check-out dates
  reviews: [], // Reviews not provided in search results
  scrapeUrl: scrapeUrl,
});

export const evolveVacationRentalScraper: DirectSiteScraper = async ({
  checkIn,
  checkOut,
  numOfOffersInEachScraper = 5,
}) => {
  const url = `https://evolve.com/vacation-rentals/search?query=Manhattan-Beach--CA--USA&adults=2&children=1&startDate=${checkIn.toISOString().split('T')[0]}&endDate=${checkOut.toISOString().split('T')[0]}`;
  
  const properties = await fetchEvolveData(url);
  
  return properties
    .slice(0, numOfOffersInEachScraper)
    .map(prop => mapToScrapedListing(prop, url));
};

export const evolveVacationRentalSubScraper: SubsequentScraper = async ({
  originalListingId,
  scrapeUrl,
  checkIn,
  checkOut,
}) => {
  try {
    const url = `https://evolve.com/vacation-rentals/${originalListingId}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const scriptContent = $('#__NEXT_DATA__').html();
    if (!scriptContent) throw new Error('Could not find script content');
    
    const jsonData = JSON.parse(scriptContent);
    const propertyData = jsonData.props.pageProps.property;
    
    const isAvailable = propertyData.available;
    const totalPrice = propertyData.pricing.total;
    const originalNightlyPrice = Math.round(totalPrice / getNumNights(checkIn, checkOut));

    return {
      originalNightlyPrice,
      isAvailableOnOriginalSite: isAvailable,
      availabilityCheckedAt: new Date(),
    };
  } catch (error) {
    console.error("Error in evolveVacationRentalSubScraper", error);
    return {
      isAvailableOnOriginalSite: false,
      availabilityCheckedAt: new Date(),
    };
  }
};