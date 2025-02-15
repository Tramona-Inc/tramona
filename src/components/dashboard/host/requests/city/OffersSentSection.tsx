import React from "react";
import { HostRequestsPageOfferData } from "@/server/types/propertiesRouter";
import PastOfferCard from "./PastOfferCard";
import { Button } from "@/components/ui/button";
import {
  RequestCardLoadingGrid,
  RequestCardLoadingSkeleton,
} from "../RequestCardLoadingGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { formatOfferData } from "@/utils/utils";
import { useState } from "react";
import { useHostTeamStore } from "@/utils/store/hostTeamStore"; // Import store

interface OffersSentSectionProps {
  setOfferWithdrawalDialogOpen: (open: boolean) => void;
  setSelectedOffer: (offerId: number | null) => void;
  city: string | string[] | undefined; // Add city prop
}

const OffersSentSection: React.FC<OffersSentSectionProps> = ({
  setOfferWithdrawalDialogOpen,
  setSelectedOffer,
  city, // Receive city as prop
}) => {
  const router = useRouter();
  const { currentHostTeamId } = useHostTeamStore(); // Get host team ID from store
  const [cityOfferData, setCityOfferData] = useState<
    HostRequestsPageOfferData | undefined
  >(undefined);

  const { isLoading: isSentOffersLoading } =
    api.offers.getAllHostOffers.useQuery(
      { currentHostTeamId: currentHostTeamId! }, // Use non-null assertion as currentHostTeamId is checked
      {
        enabled: !!currentHostTeamId,
        onSuccess: (fetchedOffers) => {
          const formattedData = formatOfferData(fetchedOffers);
          const offersWithProperties = formattedData.sent
            ? Object.values(formattedData.sent).find((o) => o.city === city)
            : [];
          setCityOfferData(offersWithProperties as HostRequestsPageOfferData);
        },
      },
    );

  if (isSentOffersLoading || !router.isReady || !cityOfferData) {
    return (
      <div className="w-full">
        <RequestCardLoadingGrid />
      </div>
    );
  }

  return (
    <div className="w-full">
      {cityOfferData.requests.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {cityOfferData.requests.map((offerData) => (
            <div key={offerData.offer.id} className="mb-4">
              <PastOfferCard
                request={offerData.request}
                offer={offerData.offer}
                property={offerData.property}
              >
                <Button
                  onClick={() => {
                    setOfferWithdrawalDialogOpen(true);
                    setSelectedOffer(offerData.offer.id);
                  }}
                >
                  Withdraw
                </Button>
              </PastOfferCard>
            </div>
          ))}
        </div>
      ) : (
        // Empty state - consider moving to a separate component
        <Card className="flex h-full items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Home className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No offers found
            </h3>
            <p className="max-w-sm text-sm text-gray-500">
              No offers have been sent for this city yet.
            </p>
            <Button
              className="mt-4"
              variant="primary"
              onClick={() => router.push("/host/calendar")} // or wherever appropriate
            >
              Go to Calendar
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OffersSentSection;
