import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";
import { NewCityRequestBtn } from "./NewCityRequestBtn";
import RequestCard from "./RequestCard";
import { RequestCardAction } from "./RequestCardAction";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import RequestAndBidLoadingState from "./RequestAndBidLoadingState";

export default function ActiveRequestsTab() {
  const { data: requests, isLoading } = api.requests.getMyRequests.useQuery();

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <NewCityRequestBtn />
        <Alert className="">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>
            Requests are sent to all hosts with vacancies in the area. Make a
            request and uncover one-of-a-kind offers to stay at their
            properties.
          </AlertDescription>
        </Alert>
      </div>
      {isLoading ? (
        <RequestAndBidLoadingState />
      ) : requests && requests.activeRequests.length !== 0 ? (
        <div className="space-y-3 pb-32">
          {requests.activeRequests.map((request) => (
            <RequestCard key={request.id} type="guest" request={request}>
              <RequestCardAction request={request} />
            </RequestCard>
          ))}
        </div>
      ) : (
        <EmptyStateValue
          title={"No city requests"}
          description={
            "You don't have any active requests. Requests that you submit will show up here."
          }
          redirectTitle={"Request Deal"}
          href={"/?tab=name-price"}
        >
          <RequestEmptySvg />
        </EmptyStateValue>
      )}
    </div>
  );
}
