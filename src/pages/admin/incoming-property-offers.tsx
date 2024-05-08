import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import PropertyOfferCard from "@/components/requests/PropertyOfferCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, type RouterOutputs } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import Head from "next/head";

function IncomingPropertyOfferCards({
  propertyOffers,
}: {
  propertyOffers?: RouterOutputs["biddings"]["getAllPending"];
}) {
  if (!propertyOffers) return <Spinner />;
  if (propertyOffers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 pt-32">
        <p className="text-center text-muted-foreground">
          No incoming property offers right now
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {propertyOffers.map((offer) => (
        <PropertyOfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  );
}

export default function Page() {
  const { data: propertyOffers } = api.biddings.getAllPending.useQuery();
  const createRandomOffer = api.biddings.createRandom.useMutation({
    onError: () => errorToast(),
  });

  return (
    <DashboardLayout type="admin">
      <Head>
        <title>Incoming property offers | Tramona</title>
      </Head>
      <div className="px-4 pb-64 pt-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-4">
            <h1 className="py-4 text-3xl font-bold text-black">
              Incoming property offers
            </h1>
            <Badge variant="secondary" className="empty:hidden">
              {propertyOffers?.length}
            </Badge>
          </div>
          <div className="flex justify-end pb-2">
            <Button
              onClick={() => createRandomOffer.mutate()}
              disabled={createRandomOffer.isLoading}
            >
              Create random offer
            </Button>
          </div>
          <IncomingPropertyOfferCards propertyOffers={propertyOffers} />
        </div>
      </div>
    </DashboardLayout>
  );
}
