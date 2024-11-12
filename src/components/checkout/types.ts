import { type PropertyPageData } from "../propertyPages/PropertyPage";

export type RequestToBookPricing = {
  travelerOfferedPriceBeforeFees: number;
  datePriceFromAirbnb: number | null;
  discount: number;
};

export interface UnifiedCheckoutData {
  ///MUST BE TRANSFORMED IN THIS BEFORE GOING INTO THE UNIFIEC CHECKOUT PAGE
  type: "bookItNow" | "offer" | "requestToBook";
  offerId?: number | undefined;
  dates: {
    checkIn: Date;
    checkOut: Date;
  };
  guests: number | null;
  scrapeUrl: string | null;
  property: PropertyPageData;
  pricing: RequestToBookPricing;
}

// ------------ USED FOR PAYMENT BREAK DOWN   -----

//input for non-properties
export type PropertyAndTripParams = {
  dates: {
    checkIn: Date;
    checkOut: Date;
  };
  travelerPriceBeforeFees: number;
  property: PropertyPageData;
};

//output
export type PriceBreakdownOutput = {
  totalTripAmount: number;
  taxesPaid: number;
  taxPercentage: number;
  superhogFee: number;
  stripeTransactionFee: number;
  totalSavings: number;
};
