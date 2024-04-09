// these types are only being used for fake data and wont be needed soon

import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";

/**
 * Represents the offer type.
 */
export type OfferType = {
  id: number;
  propertyName: string;
  hostName: string;
  beds: number;
  baths: number;
  area: number;
  price: number;
  originalPrice: number;
  rating: number;
  ratingCount: number;
  status: string;
  imageUrl: string;
  airbnbUrl: string;
  requestId: number;
  createdAt: string;
  updatedAt: string;
  address: string;
};

type OfferPreview = Omit<
  OfferType,
  | "id"
  | "rating"
  | "ratingCount"
  | "status"
  | "imageUrl"
  | "airbnbUrl"
  | "address"
  | "beds"
  | "baths"
  | "createdAt"
  | "updatedAt"
  | "area"
>;

export type OldAmenity =
  | {
      type: "Baths" | "Beds";
      count: number | null;
    }
  | { type: "Ocean" };

export type OfferDetailType = OfferPreview & {
  imageUrls: string[] | null;
  avatar: string | null;
  reviewCount: number | null;
  verified: boolean | null;
  superHost: boolean | null;
  hostEmail: string | null;
  propertyDescription: string | null;
  guestReviews: string[] | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: number | null;
  amenites: OldAmenity[] | null;
};

export type LiveDeals = {
  imageUrl: string | null;
  minutesAgo: number | null;
  tramonaPrice: number | null;
  oldPrice: number | null;
};

export type TramonaDatabase = PostgresJsDatabase<
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  typeof import("@/server/db/schema")
>;
