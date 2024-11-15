import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";
import { NewCityRequestBtn } from "./NewCityRequestBtn";
import RequestCard from "./RequestCard";
import { RequestCardAction } from "./RequestCardAction";

export default function ActiveRequestsTab() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.activeRequests.length !== 0 ? (
    <div className="space-y-4 pb-32">
      <NewCityRequestBtn />

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
      href={"/"}
    >
      <RequestEmptySvg />
    </EmptyStateValue>
  );
}
