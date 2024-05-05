import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import { RequestCards } from "./RequestCards";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";

export default function ActiveRequestGroups() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <RequestCards requestGroups={requests.activeRequestGroups} />
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
