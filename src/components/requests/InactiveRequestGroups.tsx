import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import Spinner from "@/components/_common/Spinner";
import { RequestCards } from "@/components/requests/RequestCards";
import { api } from "@/utils/api";
import HistoryEmptySvg from "../_common/EmptyStateSvg/HistoryEmptySvg";

export default function InactiveRequestGroups() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.inactiveRequestGroups.length !== 0 ? (
    <RequestCards requestGroups={requests.inactiveRequestGroups} />
  ) : (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center">
        <EmptyStateValue
          title={"You have no history"}
          description={"Completed requests will show up here. "}
          redirectTitle={"Request Deal"}
          href={"/"}
        >
          <HistoryEmptySvg />
        </EmptyStateValue>
      </p>
    </div>
  );
}
