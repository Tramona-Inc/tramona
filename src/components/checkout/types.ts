import { type PropertyPageData } from "../propertyPages/PropertyPage";
import { RouterOutputs } from "@/utils/api";

export type RequestToBookProperty =
  RouterOutputs["requestsToBook"]["getMyRequestsToBook"]["activeRequestsToBook"][number]["property"];

export type RequestToBookPricing = {
  calculatedTravelerPrice: number;
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
  property: PropertyPageData | RequestToBookProperty;
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
