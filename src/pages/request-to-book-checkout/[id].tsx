import MainLayout from "@/components/_common/Layout/MainLayout";
import Spinner from "@/components/_common/Spinner";
import { requestOrBookItNowToUnifiedData } from "@/components/checkout/transformToUnifiedCheckoutData";
import { UnifiedCheckout } from "@/components/checkout/UnifiedCheckout";
import { api } from "@/utils/api";
import { useGetOriginalPropertyPricing } from "@/utils/payment-utils/useGetOriginalPropertyPricing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Page() {
  useSession({ required: true });
  const router = useRouter();
  const { query } = useRouter();

  const propertyId = parseInt(router.query.id as string);
  const checkIn = query.checkIn
    ? new Date(query.checkIn as string)
    : new Date();
  const checkOut = query.checkOut
    ? new Date(query.checkOut as string)
    : new Date();
  const numGuests = query.numGuests ? parseInt(query.numGuests as string) : 2;

  const requestPercentage = parseInt(
    //exclusive to request-to-book
    query.requestPercentage as string,
  );

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

  const unifiedCheckoutData =
    property && propertyPricing.calculatedTravelerPrice
      ? requestOrBookItNowToUnifiedData({
          property,
          checkIn,
          checkOut,
          numGuests,
          travelerOfferedPrice: propertyPricing.calculatedTravelerPrice,
          type: "requestToBook",
        })
      : null;

  return (
    <MainLayout>
      <div className="mx-auto my-8 min-h-screen-minus-header-n-footer max-w-6xl sm:my-16">
        {unifiedCheckoutData && property && !propertyPricing.error ? (
          <UnifiedCheckout unifiedCheckoutData={unifiedCheckoutData} />
        ) : (
          <Spinner />
        )}
      </div>
    </MainLayout>
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
