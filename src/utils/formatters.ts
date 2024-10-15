import { type User } from "@/server/db/schema";

/**
 * The difference from utils.ts is that these functions are specific
 * to our data/project, whereas utils.ts are small functions that you could
 * copy paste between projects
 */

export function getRequestStatus(request: {
  resolvedAt: Date | null;
  offers: unknown[];
}) {
  if (request.resolvedAt) {
    return request.offers.length === 0 ? "rejected" : "booked";
  }
  return request.offers.length === 0 ? "pending" : "accepted";
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
      return "/";
    case "host":
      return "/host";
    case "admin":
      return "/admin";
  }
}

//(XXX) XXX-XXXX format.
export const formatPhoneNumberWithParentheses = (phoneNumber: string) => {
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
};

// TODO: make this not specific to map screenshots
export function getS3ImgUrl(fileName: string) {
  return `https://tramona-map-screenshots.s3.us-east-1.amazonaws.com/${fileName}`;
}
