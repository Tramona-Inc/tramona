import MainLayout from "@/components/_common/Layout/MainLayout";
import Spinner from "@/components/_common/Spinner";
import Checkout from "@/components/requests/Checkout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Page() {
  useSession({ required: true });
  const router = useRouter();
  const offerId = parseInt(router.query.id as string);

  const { data: offer } = api.offers.getByIdWithDetails.useQuery(
    { id: offerId },
    {
      enabled: router.isReady,
    },
  );

  if (router.isFallback) {
    return <h2>Loading</h2>;
  }

  return (
    <MainLayout>
      <div className="mx-auto my-8 min-h-screen-minus-header-n-footer max-w-6xl sm:my-16">
        {offer ? <Checkout offer={offer} /> : <Spinner />}
      </div>
    </MainLayout>
  );
}
