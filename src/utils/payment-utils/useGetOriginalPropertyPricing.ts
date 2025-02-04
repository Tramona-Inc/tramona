import { api } from "@/utils/api";
import {
  getNumNights,
  getApplicableBookItNowAndRequestToBookDiscountPercentage,
} from "@/utils/utils";
import { PropertyPageData } from "@/components/propertyPages/PropertyPage";
import { isNumber } from "lodash";
import { TRAVELER_MARKUP } from "../constants";
import { getAdditionalFees } from "./payment-utils";
import { breakdownPaymentByPropertyAndTripParams } from "./paymentBreakdown";

export const useGetOriginalPropertyPricing = ({
  property,
  checkIn,
  checkOut,
  numGuests,
  requestPercentage,
}: {
  property: PropertyPageData | undefined;
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  requestPercentage?: number;
}) => {
  // Always define these, even if property is undefined
  const isHospitable = property?.originalListingPlatform === "Hospitable";
  const numNights = getNumNights(checkIn, checkOut);

  // Host price logic
  const { data: hostPricePerNight, isLoading: isHostPriceLoading } =
    api.misc.getAverageHostPropertyPrice.useQuery(
      {
        property: property!,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        numGuests,
      },
      {
        enabled: isHospitable && !!property, // Ensure hooks always run but only fetch when valid
      },
    );
  console.log(hostPricePerNight);

  // Scraped property logic - using tempCasamundoPrice
  const casamundoPrice = property?.tempCasamundoPrice;
  console.log("casamundoPrice", casamundoPrice);
  const isCasamundoPriceLoading = false;

  // Reserved dates
  const { data: bookedDates } = api.calendar.getReservedDates.useQuery(
    {
      propertyId: property?.id ?? 0, // Fallback for undefined property
    },
    {
      enabled: !!property, // Ensure hooks always run but only fetch when valid
    },
  );

  // unifiying data.
  const originalBasePrice = // price of all nights!
    isHospitable && hostPricePerNight
      ? hostPricePerNight * numNights
      : isNumber(casamundoPrice)
        ? casamundoPrice
        : undefined;

  console.log(originalBasePrice);

  // Early exit if originalBasePrice is undefined
  if (originalBasePrice === undefined || property === undefined) {
    return {
      additionalFees: getAdditionalFees({
        property: property ?? ({} as PropertyPageData), // Provide empty object as fallback to avoid errors in getAdditionalFees
        numOfNights: numNights,
        numOfGuests: numGuests,
        numOfPets: 0,
      }),
      originalBasePrice: undefined,
      calculatedBasePrice: undefined,
      calculatedTravelerPrice: undefined,
      hostDiscountPercentage: undefined,
      amountSaved: undefined,
      casamundoPrice: isHospitable ? undefined : casamundoPrice,
      isLoading: isHospitable ? isHostPriceLoading : isCasamundoPriceLoading,
      error: "Original price is unavailable.",
      bookedDates,
      isHostPriceLoading,
      isCasamundoPriceLoading,
      brokedownPaymentOutput: undefined, // Add undefined for brokedownPaymentOutput
      travelerCalculatedAmountWithSecondaryLayerWithoutTaxes: undefined, // Add undefined for travelerCalculatedAmountWithSecondaryLayerWithoutTaxes
    };
  }

  // <--------------------------------- DISCOUNTS HERE (goal is to create calculatedBasePrice ) --------------------------------->

  // 1.) apply traveler requested bid amount if request to book
  let calculatedBasePrice: number = originalBasePrice; // Initialize with originalBasePrice

  if (requestPercentage) {
    calculatedBasePrice = originalBasePrice * (1 - requestPercentage / 100);
  }

  //2.)apply discount tier discounts
  const hostDiscountPercentage = isHospitable //hostDiscountPercentage = percent off
    ? getApplicableBookItNowAndRequestToBookDiscountPercentage(property)
    : undefined;

  let amountSaved: number | undefined;
  if (originalBasePrice && (requestPercentage ?? hostDiscountPercentage)) {
    const hostDiscount = (hostDiscountPercentage ?? 0) / 100;
    const requestDiscount = (requestPercentage ?? 0) / 100;
    amountSaved =
      originalBasePrice * hostDiscount + originalBasePrice * requestDiscount;
  }
  console.log(amountSaved);

  calculatedBasePrice =
    calculatedBasePrice * (1 - (hostDiscountPercentage ?? 0) / 100);

  // < ----------------------- GET THE calculatedTravelerPrice. (calculatedPricePerNight  * travelerMarkup ) + additional Fees  ------------------------------------- >
  const additionalFees = getAdditionalFees({
    property: property,
    numOfNights: numNights,
    numOfGuests: numGuests,
    numOfPets: 0, //zero since feature isnt implemented yet
  });
  console.log;

  console.log(calculatedBasePrice);
  const calculatedTravelerPrice =
    calculatedBasePrice * TRAVELER_MARKUP + additionalFees.totalAdditionalFees;

  console.log(calculatedTravelerPrice);

  // this is basically everything minus taxes only use this for display and front end, dont use this for checkout calcultions or input throught stripe
  const brokedownPaymentOutput = breakdownPaymentByPropertyAndTripParams({
    dates: {
      checkIn: checkIn,
      checkOut: checkOut,
    },
    calculatedTravelerPrice: calculatedTravelerPrice,
    property: property,
  });

  console.log(brokedownPaymentOutput);

  const travelerCalculatedAmountWithSecondaryLayerWithoutTaxes =
    calculatedTravelerPrice +
    brokedownPaymentOutput.stripeTransactionFee +
    brokedownPaymentOutput.superhogFee;

  console.log(travelerCalculatedAmountWithSecondaryLayerWithoutTaxes);

  // Return everything as undefined or valid values, but ensure hooks are always run
  return {
    //------PRICE OF ALL NIGHTS NOT SINGLE
    additionalFees,
    originalBasePrice,
    calculatedBasePrice, //we really only care about this
    calculatedTravelerPrice,
    hostDiscountPercentage,
    amountSaved,
    travelerCalculatedAmountWithSecondaryLayerWithoutTaxes, // for front end only used to display for travelers
    brokedownPaymentOutput, //just in case
    //casamundo variables
    casamundoPrice: isHospitable ? undefined : casamundoPrice, //REVISIT ONCE SCRAPER IS FIXED  note: used if you want prices without modification
    // refetchCasamundoPrice,

    // other nonpricing variables
    isLoading: isHospitable ? isHostPriceLoading : isCasamundoPriceLoading,
    error: null, // Error is handled by early exit
    bookedDates,
    isHostPriceLoading,
    isCasamundoPriceLoading,
  };
};
