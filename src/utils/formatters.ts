import { type User, type Request } from "@/server/db/schema";
import { capitalize } from "./utils";

/**
 * The difference from utils.ts is that these functions are specific
 * to our data/project, whereas utils.ts are small functions that you could
 * copy paste between projects
 */

export function getFmtdFilters(
  filters: Partial<
    Pick<Request, "minNumBedrooms" | "minNumBeds" | "propertyType" | "note">
  >,
  { withoutNote = false, excludeDefaults = false } = {},
  // this is getting to be convoluted but oh well
) {
  const fmtdMinNumBedrooms =
    (filters.minNumBedrooms ?? "") === ""
      ? undefined
      : `${filters.minNumBedrooms}+ bedrooms`;

  const fmtdMinNumBeds =
    (filters.minNumBeds ?? "") === ""
      ? undefined
      : `${filters.minNumBeds}+ beds`;

  const fmtdFiltersList = [
    !(filters.minNumBedrooms === 1 && excludeDefaults) && fmtdMinNumBedrooms,
    !(filters.minNumBeds === 1 && excludeDefaults) && fmtdMinNumBeds,
    filters.propertyType && capitalize(filters.propertyType),
    !withoutNote && filters.note,
  ].filter(Boolean);

  return fmtdFiltersList.length === 0 ? undefined : fmtdFiltersList.join(" • ");
}

export function getRequestStatus(request: {
  resolvedAt: Date | null;
  numOffers: number;
}) {
  if (request.resolvedAt) {
    return request.numOffers === 0 ? "rejected" : "booked";
  }
  return request.numOffers === 0 ? "pending" : "accepted";
}

export function isIncoming(request: Parameters<typeof getRequestStatus>[0]) {
  return getRequestStatus(request) === "pending";
}

export function formatPhoneNumber(phoneNumber: string) {
  const removeNonDigit = phoneNumber.replace(/\D/g, "");
  return "+1" + removeNonDigit;
}

export function getHomePageFromRole(role: User["role"]) {
  switch (role) {
    case "guest":
      return "/dashboard";
    case "host":
      return "/host";
    case "admin":
      return "/admin";
  }
}

// TODO: make this not specific to map screenshots
export function getS3ImgUrl(fileName: string) {
  return `https://tramona-map-screenshots.s3.us-east-1.amazonaws.com/${fileName}`;
}
