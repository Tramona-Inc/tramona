import { z } from "zod";
import { zodUrl } from "../zod-utils";
import { Airbnb } from "./Airbnb";
import { BookingDotCom } from "./BookingDotCom";
import { Vrbo } from "./Vrbo";
import { Property, type ListingSiteName } from "@/server/db/schema";

export type ListingSiteUrlParams = Readonly<{
  checkIn?: string | Date;
  checkOut?: string | Date;
  numGuests?: number;
}>;

export type OriginalListing = Readonly<{
  id: string;
  site: ListingSite;

  getListingUrl(params: ListingSiteUrlParams): string;
  getReviewsUrl(params: ListingSiteUrlParams): string;
  getCheckoutUrl(params: ListingSiteUrlParams): string;
}>;

export type ListingSite = Readonly<{
  siteName: ListingSiteName;
  baseUrl: string;

  parseId(url: string): string | undefined;
  parseUrlParams(url: string): {
    checkIn?: string;
    checkOut?: string;
    numGuests?: number;
  };
  expandUrl(url: string): Promise<string | undefined>;
  createListing(id: string): OriginalListing;
}>;

const ALL_LISTING_SITES = [Airbnb, BookingDotCom, Vrbo] as const;

function getSiteURLParser(Site: ListingSite) {
  return zodUrl()
    .startsWith(Site.baseUrl)
    .transform(Site.parseId)
    .pipe(z.string().min(1, { message: "Must be a link to a listing" }))
    .transform((listingId) => ({ listingId, Site }));
}

// this is used...
export const zodListingUrl = zodUrl().pipe(
  z
    .string()
    .refine(
      (url) => ALL_LISTING_SITES.some((Site) => url.startsWith(Site.baseUrl)),
      { message: "Must be from Airbnb, Booking.com, or Vrbo" },
    )
    .refine(
      (url) =>
        ALL_LISTING_SITES.some(
          (Site) => url.startsWith(Site.baseUrl) && Site.parseId(url),
        ),
      { message: "Must be a link to a listing" },
    ),
);

// to ensure that this will work without erroring
export function parseListingUrl(url: string) {
  return z
    .union([
      getSiteURLParser(Airbnb),
      getSiteURLParser(BookingDotCom),
      getSiteURLParser(Vrbo),
    ])
    .parse(url);
}

export function createListing({
  id,
  siteName,
}: {
  id: string;
  siteName: ListingSiteName;
}) {
  const Site = ALL_LISTING_SITES.find((Site) => Site.siteName === siteName)!;
  return Site.createListing(id);
}

export function getOriginalListing(
  property: Pick<Property, "originalListingPlatform" | "originalListingId">,
) {
  if (
    !property.originalListingPlatform ||
    !property.originalListingId ||
    !(
      property.originalListingPlatform === "Airbnb" ||
      property.originalListingPlatform === "Booking.com" ||
      property.originalListingPlatform === "Vrbo"
    )
  ) {
    return null;
  }
  return createListing({
    id: property.originalListingId,
    siteName: property.originalListingPlatform,
  });
}
