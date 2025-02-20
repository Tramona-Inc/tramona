import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import HostRequestCard from "@/components/dashboard/host/requests/city/HostRequestCard";
import { RequestCardLoadingGrid } from "../RequestCardLoadingGrid";
import { Button } from "@/components/ui/button";

import { type Property } from "@/server/db/schema";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { useHostTeamStore } from "@/utils/store/hostTeamStore"; // Import store
import NoRequestEmptyState from "../NoRequestEmptyState";
import PaginationButtons from "@/components/_common/PaginationButtons";
import OnlyOtherRequestState from "./OnlyOtherRequestState";
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
  const { query } = useRouter(); // Get query from router

  const { currentHostTeamId } = useHostTeamStore();

  const { city, option } = useMemo(() => {
    return {
      city: query.city as string | undefined,
      option: query.option as string | undefined,
    };
  }, [query.city, query.option]);


  const priceRestriction = option === "other";


  const { normal, other } = separatedData ?? { normal: [], other: [] };
  const noNormalRequests = normal.length === 0;
  const hasOtherRequests = other.length > 0;
  const completelyEmpty = noNormalRequests && other.length === 0;

  const requestsWithProperties = priceRestriction
    ? separatedData?.other
    : separatedData?.normal;

  console.log(requestsWithProperties);

  const cityRequestsData = requestsWithProperties?.find((p) => p.city === city);
  console.log(cityRequestsData);

  const currentCityRequests = cityRequestsData?.requests;

  console.log(currentCityRequests);

  //pagination logic begins (used for PaginationButtons.tsx)
  // todo: put all logic into PaginationButtons.tsx

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 8;

  const paginatedCityRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return currentCityRequests?.slice(startIndex, endIndex);
  }, [currentCityRequests, currentPage, ITEMS_PER_PAGE]);

  // pagination logic ends

  if (
    isRequestsLoading ||
    !router.isReady
    // currentCityRequests === undefined
  )

  {
    console.log("loading");
    return (
      <div className="w-full">
        <RequestCardLoadingGrid />
      </div>
    );
  }
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
      ) : (
        <>
          {completelyEmpty && <NoRequestEmptyState />}
          {noNormalRequests && hasOtherRequests && <OnlyOtherRequestState />}
        </>
      )}
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
