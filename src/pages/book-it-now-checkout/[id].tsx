import MainLayout from "@/components/_common/Layout/MainLayout";
import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UnifiedCheckout } from "@/components/checkout/UnifiedCheckout";
import { requestOrBookItNowToUnifiedData } from "@/components/checkout/transformToUnifiedCheckoutData";
import { useGetOriginalPropertyPricing } from "@/utils/payment-utils/useGetOriginalPropertyPricing";
import { useMemo } from "react";

export default function Page() {
  useSession({ required: true });
  const router = useRouter();
  const { query } = useRouter();

  // Memoize query parameter extraction
  const { propertyId, checkIn, checkOut, numGuests } = useMemo(() => {
    const propertyId = parseInt(query.id as string);
    const checkIn = query.checkIn
      ? new Date(query.checkIn as string)
      : new Date();
    const checkOut = query.checkOut
      ? new Date(query.checkOut as string)
      : new Date();
    const numGuests = query.numGuests ? parseInt(query.numGuests as string) : 2;
    return { propertyId, checkIn, checkOut, numGuests };
  }, [query]);

  // Memoize property data fetching
  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    { enabled: router.isReady },
  );

  // Memoize property pricing calculation
  const propertyPricing = useGetOriginalPropertyPricing({
    property,
    checkIn,
    checkOut,
    numGuests,
  });

  // Memoize unifiedCheckoutData creation
  const unifiedCheckoutData = useMemo(() => {
    if (property && propertyPricing.calculatedTravelerPrice) {
      return requestOrBookItNowToUnifiedData({
        property,
        checkIn,
        checkOut,
        numGuests,
        calculatedTravelerPrice: propertyPricing.calculatedTravelerPrice,
        additionalFees: propertyPricing.additionalFees.totalAdditionalFees,
        type: "bookItNow",
      });
    }
    return null;
  }, [property, propertyPricing, checkIn, checkOut, numGuests]);

  if (router.isFallback) {
    return (
      <MainLayout>
        <div className="mx-auto my-8 min-h-screen-minus-header-n-footer max-w-6xl sm:my-16">
          <h2>Loading...</h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto my-8 min-h-screen-minus-header-n-footer max-w-6xl sm:my-16">
        {unifiedCheckoutData ? (
          <UnifiedCheckout unifiedCheckoutData={unifiedCheckoutData} />
        ) : (
          <Spinner />
        )}
      </div>
    </MainLayout>
  );
}
