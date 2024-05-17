import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import { RequestCards } from "./RequestCards";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";
import SimiliarProperties from "./SimilarProperties";
import { useState } from "react";
import { type DetailedRequest } from "@/components/requests/RequestCard";
import { useMediaQuery } from "../_utils/useMediaQuery";
export default function ActiveRequestGroups() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { data: requests } = api.requests.getMyRequests.useQuery();
  //you can access all of the request details with selectedRequest
  const [selectedRequest, setSelectedRequest] =
    useState<DetailedRequest | null>(null);

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <div>
      {isMobile && (
        <p className="my-5 flex w-11/12 px-4 text-sm md:hidden">
          {" "}
          Submit bids while waiting for your request to increase your chance of
          getting a great deal.
        </p>
      )}
      <div className="grid grid-cols-2 gap-24">
        <div className="col-span-1">
          <RequestCards
            requestGroups={requests.activeRequestGroups}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
          />
        </div>
        <div className="col-span-1">
          {selectedRequest?.location ? (
            !isMobile && (
              <SimiliarProperties
                location={selectedRequest!.location}
                city={selectedRequest!.location}
              />
            )
          ) : (
            <Spinner />
          )}
        </div>
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
