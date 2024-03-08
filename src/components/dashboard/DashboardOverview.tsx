import RequestCard, {
  type DetailedRequest,
} from "@/components/requests/RequestCard";
import { RequestCardAction } from "@/components/requests/RequestCardAction";
import Spinner from "../_common/Spinner";
import DesktopSearchBar from "../landing-page/SearchBar/DesktopSearchBar";

import { api } from "@/utils/api";

function RequestCards({
  requests,
}: {
  requests: DetailedRequest[] | undefined;
}) {
  return requests ? (
    <div className="grid grid-cols-2 gap-4">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request}>
          <RequestCardAction request={request} />
        </RequestCard>
      ))}
    </div>
  ) : (
    <Spinner />
  );
}

export default function DashboardOverview() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  return (
    <div className="col-span-10 2xl:col-span-11">
      <div className="bg-zinc-700 px-10 py-10 lg:px-20 xl:px-32">
        <DesktopSearchBar />
      </div>

      <div className="grid grid-cols-1 gap-5 px-10 py-10 lg:grid-cols-10 lg:px-20 xl:px-32">
        <div className="col-span-1 lg:col-span-6">
          <h2 className="text-3xl">Requests/offers</h2>
          <div className="py-5">
            {requests?.activeRequests.length !== 0 ? (
              <RequestCards requests={requests?.activeRequests} />
            ) : (
              <p className="text-muted-foreground">You have no requests yet.</p>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <h2 className="text-3xl">Upcoming trips</h2>
          <div className="py-5">
            <p className="text-muted-foreground">You have no trips yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
