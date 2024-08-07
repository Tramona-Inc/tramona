import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import { RequestCards } from "./RequestCards";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";
import { NewCityRequestBtn } from "./NewCityRequestBtn";

export default function CityRequestsTab() {
  const { data: requests } = api.requests.getMyRequests.useQuery();
  //you can access all of the request details with selectedRequest
  // const [selectedRequest, setSelectedRequest] =
  //   useState<DetailedRequest | null>(null);

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <div>
      {/* <p className="my-5 w-11/12 px-4 text-sm md:hidden">
        Submit bids while waiting for your request to increase your chance of
        getting a great deal.
      </p> */}
      {/* <div className="md:flex md:gap-8"> */}
      {/* <div className="pb-64 md:w-[450px]"> */}
      <NewCityRequestBtn />
      <div className="grid grid-cols-1 gap-4 pb-32">
        <RequestCards requestGroups={requests.activeRequestGroups} />
      </div>
      {/* </div> */}
      {/* <div className="hidden md:block md:flex-1">
          {selectedRequest?.location ? (
            <SimiliarProperties
              location={selectedRequest.location}
              city={selectedRequest.location}
            />
          ) : (
            <Spinner />
          )}
        </div> */}
      {/* </div> */}
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
