import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MainLayout from "@/components/_common/Layout/MainLayout";
import Spinner from "@/components/_common/Spinner";
import { requestOrBookItNowToUnifiedData } from "@/components/checkout/transformToUnifiedCheckoutData";
import { UnifiedCheckout } from "@/components/checkout/UnifiedCheckout";
import { api } from "@/utils/api";
import { useGetOriginalPropertyPricing } from "@/utils/payment-utils/useGetOriginalPropertyPricing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Page() {
  useSession({ required: true });
  const router = useRouter();
  const { query } = useRouter();

  // Memoize all query parameters
  const { propertyId, checkIn, checkOut, numGuests, requestPercentage } =
    useMemo(() => {
      const propertyId = parseInt(router.query.id as string);
      const checkIn = query.checkIn
        ? new Date(query.checkIn as string)
        : new Date();
      const checkOut = query.checkOut
        ? new Date(query.checkOut as string)
        : new Date();
      const numGuests = query.numGuests
        ? parseInt(query.numGuests as string)
        : 2;
      const requestPercentage = parseInt(query.requestPercentage as string);

      return { propertyId, checkIn, checkOut, numGuests, requestPercentage };
    }, [query, router.query.id]); // Added router.query.id as dependancy

  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    { enabled: router.isReady },
  );

  // <---------------- Calculate the price here  ---------------->
  console.log(requestPercentage);
  const propertyPricing = useGetOriginalPropertyPricing({
    property,
    checkIn,
    checkOut,
    numGuests,
    requestPercentage,
  });

  console.log(propertyPricing);
  // ----------------

  const unifiedCheckoutData = useMemo(() => {
    return property && propertyPricing.calculatedTravelerPrice
      ? requestOrBookItNowToUnifiedData({
          property,
          checkIn,
          checkOut,
          numGuests,
          calculatedTravelerPrice: propertyPricing.calculatedTravelerPrice,
          type: "requestToBook",
        })
      : null;
  }, [property, propertyPricing, checkIn, checkOut, numGuests]);

  return (
    <DashboardLayout>
      <div className="mx-auto my-8 min-h-screen-minus-header-n-footer max-w-6xl sm:my-16">
        {unifiedCheckoutData ? (
          <UnifiedCheckout unifiedCheckoutData={unifiedCheckoutData} />
        ) : (
          <Spinner />
        )}
      </div>
    </DashboardLayout>
  );

  //error state
  if (propertyPricing.error && !propertyPricing.isLoading) {
    return (
      <MainLayout>
        <div className="mx-auto my-8 min-h-screen-minus-header-n-footer max-w-6xl sm:my-16">
          Something went wrong ...
        </div>
      </MainLayout>
    );
  }
}
