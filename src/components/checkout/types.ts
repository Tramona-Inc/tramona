import {
  type OfferWithDetails,
  type PropertyPageData,
} from "../propertyPages/PropertyPage";

export interface RequestToBookPricing {
  requestId: null;
  scrapeUrl: string | null;
  travelerOfferedPriceBeforeFees: number;
  datePriceFromAirbnb: number;
  checkIn: Date;
  checkOut: Date;
}

export interface CheckoutData {
  title: string;
  dates: {
    checkIn: Date;
    checkOut: Date;
  };
  guests: number | null;
  property: PropertyPageData;
  pricing: RequestToBookPricing | null;
  discount: number;
}
