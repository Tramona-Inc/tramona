import { type PropertyPageData } from "../propertyPages/PropertyPage";
import { RouterOutputs } from "@/utils/api";

export type RequestToBookProperty =
  RouterOutputs["requestsToBook"]["getMyRequestsToBook"]["activeRequestsToBook"][number]["property"];

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
  guests: number;
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
  numOfGuests: number;
};

//output
export type PriceBreakdownOutput = {
  totalTripAmount: number;
  taxesPaid: number;
  taxPercentage: number;
  superhogFee: number;
  stripeTransactionFee: number;
  totalSavings: number;
  cleaningFeePerStay: number | null | undefined; //undefined for OFFERS  NULL OR NUMBER FOR requestToBook/bookItNow
  petFeePerStay: number | null | undefined;
  totalExtraGuestFee: number | null | undefined;
  totalAdditionalFees: number | undefined;
};
