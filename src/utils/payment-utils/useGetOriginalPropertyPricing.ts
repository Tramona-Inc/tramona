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
  const hostDiscount = isHospitable
    ? getApplicableBookItNowDiscount({
        bookItNowDiscountTiers: property.bookItNowDiscountTiers ?? [],
        checkIn,
      })
    : undefined;

  const hostPriceAfterDiscount = hostDiscount
    ? hostPricePerNight
      ? hostPricePerNight * (1 - hostDiscount)
      : undefined
    : hostPricePerNight;

  // Scraped property logic
  const {
    data: casamundoPrice, // is this per night or total???
    isLoading: isCasamundoPriceLoading,
    refetch: refetchCasamundoPrice,
  } = api.misc.scrapeAverageCasamundoPrice.useQuery(
    {
      offerId: property?.originalListingId ?? "", // Fallback for undefined property
      checkIn,
      numGuests: numGuests || 2,
      duration: numNights,
    },
    {
      enabled: !isHospitable && !!property, // Ensure hooks always run but only fetch when valid
      refetchOnWindowFocus: false,
    },
  );

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
  let originalPricePerNight = isHospitable
    ? hostPriceAfterDiscount
    : isNumber(casamundoPrice)
      ? casamundoPrice * 100
      : undefined;

  //traveler requested bid amount if request to book
  if (requestPercentage && originalPricePerNight) {
    originalPricePerNight =
      originalPricePerNight * (1 - requestPercentage / 100);
  }
  console.log("requestPercentage", requestPercentage);

  // Aggregate loading states
  const isLoading = isCasamundoPriceLoading && isHostPriceLoading;
  const error =
    originalPricePerNight === undefined
      ? "Original price is unavailable."
      : null;

  //Multiply be num of nights becuase original price should be total price ++ MARKUP
  const originalPrice = originalPricePerNight
    ? Math.floor(originalPricePerNight * numNights * TRAVELER_MARKUP)
    : originalPricePerNight;

  // Return everything as undefined or valid values, but ensure hooks are always run
  return {
    originalPrice, //we really only care about this
    isLoading,
    error,
    casamundoPrice: isHospitable ? undefined : casamundoPrice, //REVISIT ONCE SCRAPER IS FIXED  note: used if you want prices without modification
    hostPricePerNight: isHospitable ? hostPricePerNight : undefined, // note: used if you want prices without modification
    bookedDates,
    refetchCasamundoPrice,
    isHostPriceLoading,
    isCasamundoPriceLoading,
  };
};
