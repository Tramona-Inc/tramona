import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import RequestCard from "./RequestCard";
import { RequestCardAction } from "./RequestCardAction";

export default function PastRequestsTab() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.inactiveRequests.length !== 0 ? (
    <div className="space-y-4 pb-32">
      {requests.inactiveRequests.map((request) => (
        <RequestCard key={request.id} type="guest" request={request}>
          <RequestCardAction request={request} />
        </RequestCard>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center">
        <EmptyStateValue
          title={"You have no history"}
          description={
            "You haven't made any request or offers. Completed requests will show up here."
          }
          redirectTitle={"Request Deal"}
          href={"/"}
        />
      </p>
    </div>
  );
}
