import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import { RequestCards } from "./RequestCards";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";
import SimiliarProperties from "./SimilarProperties";
export default function ActiveRequestGroups() {
  const { data: requests } = api.requests.getMyRequests.useQuery();
  //Getting each of the request locations
  if (requests) {
    const requestLocations = Array.from(
      requests!.activeRequestGroups.map((requestGroup) =>
        requestGroup.requests.map((request) => request.location),
      ),
    ).flat();
    console.log(requestLocations);
  }
  if (!requests) return <Spinner />;

  let requestLocations: string[] = [];
  if (requests) {
    requestLocations = Array.from(
      requests!.activeRequestGroups.map((requestGroup) =>
        requestGroup.requests.map((request) => request.location),
      ),
    ).flat();
  }
  return requests.activeRequestGroups.length !== 0 ? (
    <div className="grid grid-cols-2 gap-24">
      <div className="col-span-1">
        <RequestCards requestGroups={requests.activeRequestGroups} />
      </div>
      <div className="col-span-1">
        Related properties
        {requestLocations ? (
          <SimiliarProperties locations={requestLocations} />
        ) : (
          <Spinner />
        )}
      </div>
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
