import { Offer, RequestsToBook, Property, User, Request } from "../db/schema";

export type HostRequestsPageData = {
  city: string;
  requests: {
    request: Request & {
      traveler: Pick<
        User,
        | "firstName"
        | "lastName"
        | "name"
        | "image"
        | "location"
        | "about"
        | "dateOfBirth"
        | "id"
      >;
    };
    properties: (Property & { taxAvailable: boolean })[];
  }[];
};

export type HostRequestsToBookPageData = {
  requestToBook: (RequestsToBook & {
    traveler: Pick<
      User,
      "firstName" | "lastName" | "name" | "image" | "location" | "about"
    >;
  })[];
  property: Property & { taxAvailable: boolean };
}[];

export type HostRequestsPageOfferData = {
  city: string;
  requests: {
    offer: Offer;
    request: {
      id: number;
      madeByGroupId: number;
      maxTotalPrice: number;
      checkIn: Date;
      checkOut: Date;
      numGuests: number;
      location: string;
      traveler: Pick<
        User,
        "firstName" | "lastName" | "name" | "image" | "location" | "about"
      >;
    };
    property: { city: string; name: string };
  }[];
};