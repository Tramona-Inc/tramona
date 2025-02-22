import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import HostRequestCard from "@/components/dashboard/host/requests/city/HostRequestCard";
import { RequestCardLoadingGrid } from "../RequestCardLoadingGrid";
import { Button } from "@/components/ui/button";

import { type Property } from "@/server/db/schema";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { useHostTeamStore } from "@/utils/store/hostTeamStore"; // Import store
import NoRequestEmptyState from "../NoRequestEmptyState";
import PaginationButtons from "@/components/_common/PaginationButtons";
import OnlyOtherRequestEmptyState from "../OnlyOtherRequestsEmptyState";
import { SeparatedData } from "@/server/server-utils";

interface CityRequestSectionProps {
  setDialogOpen: (open: boolean) => void;
  setSelectedRequest: (request: HostDashboardRequest | null) => void;
  setProperties: React.Dispatch<
    React.SetStateAction<({ taxAvailable: boolean } & Property)[] | null>
  >;
  separatedData: SeparatedData | undefined;
  isRequestsLoading: boolean;
}

const CityRequestSection: React.FC<CityRequestSectionProps> = ({
  setDialogOpen,
  setSelectedRequest,
  setProperties,
  separatedData,
  isRequestsLoading,
}) => {
  const router = useRouter();
  const { query } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const currentHostTeamId = useHostTeamStore(
    (state) => state.currentHostTeamId,
  );
  const ITEMS_PER_PAGE = 8;

  // Move all useMemo hooks to the top
  const { city, option } = useMemo(() => {
    return {
      city: query.city as string | undefined,
      option: query.option as string | undefined,
    };
  }, [query.city, query.option]);

  const paginatedCityRequests = useMemo(() => {
    if (!separatedData || !router.isReady) return null;

    const priceRestriction = option === "other";
    const { normal, other } = separatedData;
    const requestsWithProperties = priceRestriction ? other : normal;
    const cityRequestsData = requestsWithProperties.find(
      (p) => p.city === city,
    );
    const currentCityRequests = cityRequestsData?.requests;

    if (!currentCityRequests) return null;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return currentCityRequests.slice(startIndex, endIndex);
  }, [
    separatedData,
    router.isReady,
    option,
    city,
    currentPage,
    ITEMS_PER_PAGE,
  ]);

  // Wait for data to be ready
  if (!router.isReady || isRequestsLoading || !separatedData) {
    console.log("loading");
    return (
      <div className="w-full">
        <RequestCardLoadingGrid />
      </div>
    );
  }

  const priceRestriction = option === "other";
  const { normal, other } = separatedData;
  const noNormalRequests = normal.length === 0;
  const noOtherRequests = other.length === 0;
  const hasOtherRequests = other.length > 0;
  const completelyEmpty = noNormalRequests && !hasOtherRequests;

  // Check empty states
  if (completelyEmpty) {
    return <NoRequestEmptyState />;
  }

  // Show empty state when there are no other requests but normal requests exist
  if (option === "other" && noOtherRequests) {
    return <NoRequestEmptyState />;
  }

  if (noNormalRequests && hasOtherRequests && option === "normal") {
    // Get the first city that has other requests
    const firstCityWithOther = other[0]?.city;
    if (!firstCityWithOther) return null;

    // Calculate total number of other requests
    const totalOtherRequests = other.reduce(
      (acc, city) => acc + city.requests.length,
      0,
    );

    return (
      <OnlyOtherRequestEmptyState
        firstCity={firstCityWithOther}
        otherRequestsCount={totalOtherRequests}
      />
    );
  }

  // Get current city requests
  const requestsWithProperties = priceRestriction ? other : normal;
  const cityRequestsData = requestsWithProperties.find((p) => p.city === city);
  const currentCityRequests = cityRequestsData?.requests;

  return (
    <div className="w-full">
      {paginatedCityRequests && paginatedCityRequests.length > 0 ? (
        <div className="grid gap-y-4 overflow-x-hidden md:grid-cols-2 md:gap-4">
          {paginatedCityRequests.map((requestData) => (
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
      ) : null}
      {currentCityRequests && currentCityRequests.length > 0 && (
        <PaginationButtons
          items={currentCityRequests}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          router={router}
        />
      )}
    </div>
  );
};

export default CityRequestSection;
