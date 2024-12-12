import { api } from "@/utils/api";
import { getNumNights, getApplicableBookItNowDiscount } from "@/utils/utils";
import { PropertyPageData } from "@/components/propertyPages/PropertyPage";
import { isNumber } from "lodash";

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
  const { data: hostPrice, isLoading: isHostPriceLoading } =
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

  const hostDiscount = isHospitable
    ? getApplicableBookItNowDiscount({
        bookItNowDiscountTiers: property.bookItNowDiscountTiers ?? [],
        checkIn,
      })
    : undefined;

  const hostPriceAfterDiscount = hostDiscount
    ? hostPrice
      ? hostPrice * (1 - hostDiscount)
      : undefined
    : hostPrice;

  // Scraped property logic
  const {
    data: casamundoPrice,
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
  let originalPrice = isHospitable
    ? hostPriceAfterDiscount
    : isNumber(casamundoPrice)
      ? casamundoPrice * 100
      : undefined;

  //traveler requested bid amount if request to book
  if (requestPercentage && originalPrice) {
    originalPrice = originalPrice * (1 - requestPercentage / 100);
  }
  console.log("requestPercentage", requestPercentage);

  // Aggregate loading states
  const isLoading = isCasamundoPriceLoading && isHostPriceLoading;
  const error =
    originalPrice === undefined ? "Original price is unavailable." : null;

  // Return everything as undefined or valid values, but ensure hooks are always run
  return {
    originalPrice,
    isLoading,
    error,
    casamundoPrice: isHospitable ? undefined : casamundoPrice,
    hostPrice: isHospitable ? hostPrice : undefined,
    bookedDates,
    refetchCasamundoPrice,
    isHostPriceLoading,
    isCasamundoPriceLoading,
  };
};
