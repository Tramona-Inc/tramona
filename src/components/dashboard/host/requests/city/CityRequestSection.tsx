import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import HostRequestCard from "@/components/dashboard/host/requests/city/HostRequestCard";
import {
  RequestCardLoadingGrid,
  RequestCardLoadingSkeleton,
} from "../RequestCardLoadingGrid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

import { type Property } from "@/server/db/schema";
import { api } from "@/utils/api";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { separateByPriceAndAgeRestriction } from "@/utils/utils";
import { useState } from "react";
import { type SeparatedData } from "@/server/server-utils";
import { useHostTeamStore } from "@/utils/store/hostTeamStore"; // Import store
import NoRequestEmptyState from "../NoRequestEmptyState";

interface CityRequestSectionProps {
  setDialogOpen: (open: boolean) => void;
  setSelectedRequest: (request: HostDashboardRequest | null) => void;
  setProperties: React.Dispatch<
    React.SetStateAction<({ taxAvailable: boolean } & Property)[] | null>
  >;
}

const CityRequestSection: React.FC<CityRequestSectionProps> = ({
  setDialogOpen,
  setSelectedRequest,
  setProperties,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const { query } = useRouter(); // Get query from router

  const { currentHostTeamId } = useHostTeamStore();

  const { city, option } = useMemo(() => {
    return {
      city: query.city as string | undefined,
      option: query.option as string | undefined,
    };
  }, [query.city, query.option]);

  const [separatedData, setSeparatedData] = useState<SeparatedData | undefined>(
    undefined,
  );

  const priceRestriction = option === "outsidePriceRestriction";
  console.log(currentHostTeamId);
  const { isLoading: isRequestsLoading } =
    api.properties.getHostPropertiesWithRequests.useQuery(
      { currentHostTeamId: Number(currentHostTeamId!) },
      {
        enabled: !!currentHostTeamId,
        onSuccess: (fetchedProperties) => {
          const separatedProperties =
            separateByPriceAndAgeRestriction(fetchedProperties);
          setSeparatedData(separatedProperties);
        },
        onError: () => {
          // Handle error if needed, perhaps set an error state
        },
      },
    );

  const requestsWithProperties = priceRestriction
    ? separatedData?.outsidePriceRestriction
    : separatedData?.normal;

  const cityRequestsData = requestsWithProperties?.find((p) => p.city === city);

  const currentCityRequests = cityRequestsData?.requests;

  if (
    isRequestsLoading ||
    !router.isReady ||
    currentCityRequests === undefined
  ) {
    return (
      <div className="w-full">
        <RequestCardLoadingGrid />
      </div>
    );
  }
  return (
    <div className="w-full">
      {currentCityRequests.length > 0 ? (
        <div className="grid gap-y-4 overflow-x-hidden md:grid-cols-2 md:gap-4">
          {currentCityRequests.map((requestData) => (
            <div key={requestData.request.id} className="mb-4">
              <HostRequestCard
                request={requestData.request}
                currentHostTeamId={currentHostTeamId}
              >
                <Button
                  onClick={() => {
                    setDialogOpen(true);
                    setSelectedRequest(requestData.request);
                    setProperties(requestData.properties);
                  }}
                >
                  Make an offer
                </Button>
              </HostRequestCard>
            </div>
          ))}
        </div>
      ) : (
        <NoRequestEmptyState />
      )}
    </div>
  );
};

export default CityRequestSection;
