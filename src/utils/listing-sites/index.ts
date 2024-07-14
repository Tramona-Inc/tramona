import { z } from "zod";
import { zodUrl } from "../zod-utils";
import { Airbnb } from "./Airbnb";
import { BookingDotCom } from "./BookingDotCom";
import { Vrbo } from "./Vrbo";

export type ListingSiteUrlParams = {
  checkIn?: Date;
  checkOut?: Date;
  numGuests: number;
};

export type ListingSite<TSiteName extends string> = {
  readonly siteName: TSiteName;
  readonly baseUrl: string;
  readonly parseId: (url: string) => string | undefined;

  createListing: (id: string) => {
    readonly id: string;
    getListingUrl(params: ListingSiteUrlParams): string;
    getReviewsUrl(params: ListingSiteUrlParams): string;
    getCheckoutUrl(params: ListingSiteUrlParams): string;
  };
};

const ALL_LISTING_SITES = [Airbnb, BookingDotCom, Vrbo] as const;

export const ALL_LISTING_SITE_NAMES = [
  Airbnb.siteName,
  BookingDotCom.siteName,
  Vrbo.siteName,
] as const;

type ListingSiteName = (typeof ALL_LISTING_SITE_NAMES)[number];

function getSiteURLParser<TSiteName extends string>(
  Site: ListingSite<TSiteName>,
) {
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

// to ensure that this will work
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
  const Site = {
    [Airbnb.siteName]: Airbnb,
    [BookingDotCom.siteName]: BookingDotCom,
    [Vrbo.siteName]: Vrbo,
  }[siteName];

  return Site.createListing(id);
}
