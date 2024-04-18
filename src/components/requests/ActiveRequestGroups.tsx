import RequestEmptySvg from "@/components/_common/EmptyStateSvg/RequestEmptySvg";
import Spinner from "@/components/_common/Spinner";
import { RequestCards } from "@/components/requests/RequestCards";
import { api } from "@/utils/api";
import EmptyStateValue from '../_common/EmptyStateSvg/EmptyStateValue';

export default function ActiveRequestGroups() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <RequestCards requestGroups={requests.activeRequestGroups} />
  ) : (
    <EmptyStateValue
      title={"You have no city requests"}
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
