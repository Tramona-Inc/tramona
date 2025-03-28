import { pgEnum } from "drizzle-orm/pg-core";

export const ALL_PROPERTY_TYPES = [
  "Condominium",
  "Apartment",
  "Guesthouse",
  "House",
  "Loft",
  "Boat",
  "Camper/RV",
  "Chalet",
  "Bed & Breakfast",
  "Castle",
  "Tent",
  "Cabin",
  "Townhouse",
  "Bungalow",
  "Hut",
  "Dorm",
  "Aparthotel",
  "Hotel",
  "Yurt",
  "Treehouse",
  "Cottage",
  "Guest Suite",
  "Tiny House",
  "Plane",
  "Igloo",
  "Serviced apartment",
  "Other",
  "Lighthouse",
  "Tipi",
  "Cave",
  "Island",
  "Earth House",
  "Train",
  "Boutique hotel",
  "Nature lodge",
  "Hostel",
  "Timeshare",
  "Minsu (Taiwan)",
  "Ryokan (Japan)",
  "Pension (Korea)",
  "Heritage hotel (India)",
  "Barn",
  "Campsite",
  "Casa Particular (Cuba)",
  "Cycladic House",
  "Dammusi",
  "Dome House",
  "Farm Stay",
  "Holiday Park",
  "Houseboat",
  "Kezhan",
  "Ranch",
  "Religious Building",
  "Riad",
  "Shipping Container",
  "Tower",
  "Trullo",
  "Windmill",
  "Shepherd’s Hut",
  "Villa",
] as const;

export const propertyTypeEnum = pgEnum("property_type", ALL_PROPERTY_TYPES);

export type PropertyType = (typeof ALL_PROPERTY_TYPES)[number];

export const ALL_LISTING_SITE_NAMES = [
  "Airbnb",
  "Booking.com",
  "Vrbo",
  "CB Island Vacations",
  "IntegrityArizona",
  "Evolve",
  "Cleanbnb",
  "Casamundo",
  "RedAwning",
] as const;

export type ListingSiteName = (typeof ALL_LISTING_SITE_NAMES)[number];

export const listingSiteEnum = pgEnum("listing_site", ALL_LISTING_SITE_NAMES);

export const ALL_RESOLUTION_RESULTS = [
  "Approved",
  "Partially Approved",
  "Pending",
  "Insufficient Evidence",
  "Rejected",
] as const;

export const ALL_TRAVELER_CLAIM_RESPONSES = [
  "Accepted",
  "Rejected",
  "Partially Approved",
  "Pending",
] as const;

export const ALL_PAYMENT_SOURCES = [
  "Superhog",
  "Security Deposit",
  "Tramona",
] as const;
