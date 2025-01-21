import { api } from "@/utils/api";
import { getNumNights, getApplicableBookItNowDiscount } from "@/utils/utils";
import { PropertyPageData } from "@/components/propertyPages/PropertyPage";
import { isNumber } from "lodash";
import { TRAVELER_MARKUP } from "../constants";

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

  // Calculate original price
  const originalPricePerNight = isHospitable
    ? hostPricePerNight
    : isNumber(casamundoPrice)
      ? casamundoPrice
      : undefined;

  // Aggregate loading states
  const isLoading = isHospitable ? isHostPriceLoading : isCasamundoPriceLoading;
  const error =
    originalPricePerNight === undefined
      ? "Original price is unavailable."
      : null;

  //Multiply be num of nights becuase original price should be total price ++ MARKUP
  let originalTravelerPrice = originalPricePerNight
    ? Math.floor(originalPricePerNight * numNights * TRAVELER_MARKUP)
    : originalPricePerNight;

  console.log(originalTravelerPrice);
  // <--------------------------------- DISCOUNTS HERE --------------------------------->

  // 1.) apply traveler requested bid amount if request to book
  if (requestPercentage && originalTravelerPrice) {
    originalTravelerPrice =
      originalTravelerPrice * (1 - requestPercentage / 100);
  }
  //2.)apply discount tier discounts
  const hostDiscountPercentage = isHospitable //hostDiscountPercentage = percent off
    ? getApplicableBookItNowDiscount(property)
    : undefined;

  console.log(hostDiscountPercentage);

  const originalPriceAfterTierDiscount = originalTravelerPrice
    ? originalTravelerPrice * (1 - (hostDiscountPercentage ?? 0) / 100)
    : undefined;

  console.log(originalPriceAfterTierDiscount);
  // Return everything as undefined or valid values, but ensure hooks are always run
  return {
    originalTravelerPrice, //we really only care about this with total nights
    originalPriceAfterTierDiscount,
    isLoading,
    error,
    casamundoPrice: isHospitable ? undefined : casamundoPrice, //REVISIT ONCE SCRAPER IS FIXED  note: used if you want prices without modification
    hostPricePerNight: isHospitable ? hostPricePerNight : undefined, // note: used if you want prices without modification
    bookedDates,
    // refetchCasamundoPrice,
    isHostPriceLoading,
    isCasamundoPriceLoading,
  };
};
