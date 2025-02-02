import { api } from "@/utils/api";
import { getNumNights, getApplicableBookItNowDiscount } from "@/utils/utils";
import { PropertyPageData } from "@/components/propertyPages/PropertyPage";
import { isNumber } from "lodash";
import { TRAVELER_MARKUP } from "../constants";
import { getAdditionalFees } from "./payment-utils";

//returns 3 very important variables
//1. originalBasePrice
//2.  calculatedBasePrice
//3. calculatedTravelerPrice

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

  // Scraped property logic
  // const {
  //   data: casamundoPrice, // is this per night or total???
  //   isLoading: isCasamundoPriceLoading,
  //   refetch: refetchCasamundoPrice,
  // } = api.misc.scrapeAverageCasamundoPrice.useQuery(
  //   {
  //     offerId: property?.originalListingId ?? "", // Fallback for undefined property
  //     checkIn,
  //     numGuests: numGuests || 2,
  //     duration: numNights,
  //   },
  //   {
  //     enabled: !isHospitable && !!property, // Ensure hooks always run but only fetch when valid
  //     refetchOnWindowFocus: false,
  //   },
  // );
  const casamundoPrice = property?.tempCasamundoPrice;
  console.log("casamundoPrice", casamundoPrice);
  const isCasamundoPriceLoading = false;

  // To retreive additionalFees

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

  // Aggregate loading states
  const isLoading = isHospitable ? isHostPriceLoading : isCasamundoPriceLoading;
  const error =
    originalBasePrice === undefined ? "Original price is unavailable." : null;

  // <--------------------------------- DISCOUNTS HERE (goal is to create calculatedBasePrice ) --------------------------------->

  // 1.) apply traveler requested bid amount if request to book

  let calculatedBasePrice: number | undefined;

  if (requestPercentage && originalBasePrice) {
    calculatedBasePrice = originalBasePrice * (1 - requestPercentage / 100);
  }
  //2.)apply discount tier discounts
  const hostDiscount = isHospitable //hostDiscount = percent off
    ? getApplicableBookItNowDiscount(property)
    : undefined;

  calculatedBasePrice = calculatedBasePrice
    ? calculatedBasePrice * (1 - (hostDiscount ?? 0) / 100) //dont mind lint error becuase there is nothing inside getApplicatbleBookItNowDiscount();
    : undefined;

  // < ----------------------- GET THE calculatedTravelerPrice. (calculatedPricePerNight  * travelerMarkup ) + additional Fees  ------------------------------------- >
  const additionalFees = getAdditionalFees({
    property: property!,
    numOfNights: numNights,
    numOfGuests: numGuests,
    numOfPets: 0, //zero since feature isnt implemented yet
  });

  const calculatedTravelerPrice = calculatedBasePrice
    ? calculatedBasePrice * TRAVELER_MARKUP + additionalFees.totalAdditionalFees
    : undefined;

  // Return everything as undefined or valid values, but ensure hooks are always run
  return {
    //------PRICE OF ALL NIGHTS NOT SINGLE
    additionalFees,
    originalBasePrice,
    calculatedBasePrice, //we really only care about this
    calculatedTravelerPrice,
    //casamundo variables
    casamundoPrice: isHospitable ? undefined : casamundoPrice, //REVISIT ONCE SCRAPER IS FIXED  note: used if you want prices without modification
    // other nonpricing variables
    isLoading,
    error,
    bookedDates,
    // refetchCasamundoPrice,
    isHostPriceLoading,
    isCasamundoPriceLoading,
  };
};
