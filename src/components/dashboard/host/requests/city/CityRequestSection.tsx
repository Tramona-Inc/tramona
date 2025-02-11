import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import RequestCard from "@/components/requests/RequestCard";
import {
  RequestCardLoadingGrid,
  RequestCardLoadingSkeleton,
} from "../RequestCardLoadingGrid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { useChatWithUserForRequest } from "@/utils/messaging/useChatWithUserForRequest";
import { type Property } from "@/server/db/schema";
import { api } from "@/utils/api";
import { useMemo } from "react";
import { Home } from "lucide-react";
import { useRouter } from "next/router";
import { separateByPriceAndAgeRestriction } from "@/utils/utils";
import { useEffect, useState } from "react";
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
  const chatWithUserForRequest = useChatWithUserForRequest();

  const { toast } = useToast();
  const router = useRouter();
  const { query } = useRouter(); // Get query from router

  const { city, option } = useMemo(() => {
    return {
      city: query.city as string | undefined,
      option: query.option as string | undefined,
    };
  }, [query.city, query.option]);

  const { currentHostTeamId } = useHostTeamStore();

  const { mutateAsync: rejectRequest } =
    api.requests.rejectRequest.useMutation();
  const [separatedData, setSeparatedData] = useState<SeparatedData | undefined>(
    undefined,
  );

  const priceRestriction = option === "outsidePriceRestriction";

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
        <div className="grid gap-4 md:grid-cols-2">
          {currentCityRequests.map((requestData) => (
            <div key={requestData.request.id} className="mb-4">
              <RequestCard request={requestData.request} type="host">
                <Button
                  variant="secondary"
                  onClick={() => {
                    void chatWithUserForRequest(
                      requestData.request.traveler.id,
                      requestData.request.id,
                    );
                  }}
                >
                  Message User
                </Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    if (!currentHostTeamId) {
                      toast({
                        title: "Error",
                        description:
                          "Could not reject request. Host team ID is missing.",
                        variant: "destructive",
                      });
                      return;
                    }
                    await rejectRequest({
                      requestId: requestData.request.id,
                      currentHostTeamId: Number(currentHostTeamId), // Ensure currentHostTeamId is a Number here as well
                    })
                      .then(() => {
                        toast({
                          title: "Successfully rejected request",
                        });
                      })
                      .catch((error) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        if (error.data?.code === "FORBIDDEN") {
                          toast({
                            title:
                              "You do not have permission to create an offer.",
                            description:
                              "Please contact your team owner to request access.",
                          });
                        } else {
                          errorToast();
                        }
                      });
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    setDialogOpen(true);
                    setSelectedRequest(requestData.request);
                    setProperties(requestData.properties);
                  }}
                >
                  Make an offer
                </Button>
              </RequestCard>
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
