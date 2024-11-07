import MainLayout from "@/components/_common/Layout/MainLayout";
import Spinner from "@/components/_common/Spinner";
import { UnifiedCheckout } from "@/components/checkout/UnifiedCheckout";
import { api } from "@/utils/api";
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
  const requestToBook = {
    checkIn,
    checkOut,
    numGuests,
  };

  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    { enabled: router.isReady },
  );

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  return (
    <MainLayout>
      <div className="min-h-screen-minus-header-n-footer mx-auto my-8 max-w-6xl sm:my-16">
        {property ? (
          <UnifiedCheckout
            type="requestToBook"
            requestToBook={requestToBook}
            property={property}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </MainLayout>
  );
}
