import MainLayout from "@/components/_common/Layout/MainLayout";
import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { UnifiedCheckout } from "@/components/checkout/UnifiedCheckout";
import { requestOrBookItNowToUnifiedData } from "@/components/checkout/transformToUnifiedCheckoutData";

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

  const travelerOfferedPriceBeforeFees = parseInt(
    query.travelerOfferedPriceBeforeFees as string,
  );

  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    { enabled: router.isReady },
  );

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  const unifiedCheckoutData = property
    ? requestOrBookItNowToUnifiedData({
        property,
        checkIn,
        checkOut,
        numGuests,
        travelerOfferedPriceBeforeFees,
        type: "bookItNow",
      })
    : null;
  return (
    <MainLayout>
      <div className="min-h-screen-minus-header-n-footer mx-auto my-8 max-w-6xl sm:my-16">
        {unifiedCheckoutData && property ? (
          <UnifiedCheckout unifiedCheckoutData={unifiedCheckoutData} />
        ) : (
          <Spinner />
        )}
      </div>
    </MainLayout>
  );
}
