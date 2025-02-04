import { type PropertyPageData } from "../propertyPages/PropertyPage";
import { RouterOutputs } from "@/utils/api";

export type RequestToBookProperty =
  RouterOutputs["requestsToBook"]["getMyRequestsToBook"]["activeRequestsToBook"][number]["property"];

export type BookedDates = RouterOutputs["calendar"]["getReservedDates"];

export type RequestToBookPricing = {
  calculatedTravelerPrice: number;
  datePriceFromAirbnb: number | null;
  discount: number;
  additionalFees: number | null;
  requestPercentageOff?: number;
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
  calculatedTravelerPrice: number;
  property: PropertyPageData | RequestToBookProperty;
};

//output
export type PriceBreakdownOutput = {
  totalTripAmount: number | undefined; //throw error if undefined
  taxesPaid: number;
  taxPercentage: number;
  superhogFee: number;
  stripeTransactionFee: number;
  totalSavings: number;
};

//useGetOriginalPropertyPricing output
export type UseGetOriginalPropertyPricingOutput = {
  additionalFees: {
    cleaningFee: number | undefined;
    petFee: number | undefined;
    totalAdditionalFees: number; // Total of all fees
    [key: string]: any; //  allows other key value pairs to exist.
  };
  originalBasePrice: number | undefined;
  calculatedBasePrice: number | undefined;
  calculatedTravelerPrice: number | undefined;
  hostDiscountPercentage: number | undefined;
  amountSaved: number | undefined;
  travelerCalculatedAmountWithSecondaryLayerWithoutTaxes: number | undefined;
  brokedownPaymentOutput: PriceBreakdownOutput | undefined; // More specific type (IMPORTANT!)
  casamundoPrice: number | undefined | null;
  isLoading: boolean;
  error: string | null; // Can now be a string error message
  bookedDates: BookedDates; //  Determine more specific type for booked dates
  isHostPriceLoading: boolean;
  isCasamundoPriceLoading: boolean;
};

//sub of useGetORiginalPricing
export interface AdditionalFeesOutput {
  cleaningFee: number | undefined;
  petFee: number | undefined;
  extraGuestFee: number | undefined;
  totalAdditionalFees: number;
}
