import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import RequestCard from "@/components/requests/RequestCard";
import RequestCardLoadingGrid from "../RequestCardLoadingSkeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { HostRequestsPageOfferData } from "@/server/api/routers/propertiesRouter";
import { useChatWithUserForRequest } from "@/utils/messaging/useChatWithUserForRequest";
import { type Property } from "@/server/db/schema";
import { api } from "@/utils/api";

interface RequestToBookSectionProps {
  cityRequestsData: HostRequestsPageOfferData | undefined | null; // Adjust type if needed
  requestsToBookIsLoading: boolean;
  rejectRequest: ReturnType<
    typeof api.requests.rejectRequest.useMutation
  >["mutateAsync"]; // Adjust type if needed
  chatWithUserForRequest: ReturnType<typeof useChatWithUserForRequest>;
  setDialogOpen: (open: boolean) => void;
  setSelectedRequest: (request: HostDashboardRequest | null) => void;
  setProperties: React.Dispatch<
    React.SetStateAction<({ taxAvailable: boolean } & Property)[] | null>
  >; // Import Property type
  currentHostTeamId: string | number; // Adjust type if needed
}

const RequestToBookSection: React.FC<RequestToBookSectionProps> = ({
  cityRequestsData,
  requestsToBookIsLoading,
  rejectRequest,
  chatWithUserForRequest,
  setDialogOpen,
  setSelectedRequest,
  setProperties,
  currentHostTeamId,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {requestsToBookIsLoading ? (
        <RequestCardLoadingGrid />
      ) : cityRequestsData && cityRequestsData.requests.length > 0 ? (
        cityRequestsData.requests.map((requestData) => (
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
                  await rejectRequest({
                    requestId: requestData.request.id,
                    currentHostTeamId: currentHostTeamId!,
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
        ))
      ) : (
        // Consider moving Empty State to its own component for reusability
        <div className="flex h-full items-center justify-center">
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Home className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No requests found
              </h3>
              <p className="max-w-sm text-sm text-gray-500">
                Consider looser requirements or allow for more ways to book to
                see more requests.
              </p>
              <Button
                className="mt-4"
                variant="primary"
                onClick={() => router.push("/host/calendar")}
              >
                Change Restrictions
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RequestToBookSection;
