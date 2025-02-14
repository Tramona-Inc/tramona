import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import HostRequestCard from "@/components/dashboard/host/requests/city/HostRequestCard";
import {
  RequestCardLoadingGrid
} from "../RequestCardLoadingGrid";
import { Button } from "@/components/ui/button";

import { type Property } from "@/server/db/schema";
import { api } from "@/utils/api";
import { useMemo } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { query } = useRouter(); // Get query from router

  const { currentHostTeamId } = useHostTeamStore();

  const { city, option } = useMemo(() => {
    return {
      city: query.city as string | undefined,
      option: query.option as string | undefined,
    };
  }, [query.city, query.option]);

  // const [separatedData, setSeparatedData] = useState<SeparatedData | undefined>(
  //   undefined,
  // );

  const priceRestriction = option === "outsidePriceRestriction";

  const { data: separatedData, isLoading: isRequestsLoading } =
    api.properties.getHostPropertiesWithRequests.useQuery(
      {
        currentHostTeamId: Number(currentHostTeamId!),
        city: city,
      },
      {
        enabled: !!currentHostTeamId,
        // onSuccess: (fetchedProperties) => { // fetchedProperties is now SeparatedData
        //   setSeparatedData(fetchedProperties); // Directly set SeparatedData
        // },
        // onError: () => {
        //   // Handle error if needed, perhaps set an error state
        // },
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
