import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import { RequestCards } from "./RequestCards";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";
import SimiliarProperties from "./SimilarProperties";
import { useState } from "react";
import RequestCard from "./RequestCard";
import { type DetailedRequest } from "@/components/requests/RequestCard";
export default function ActiveRequestGroups() {
  const { data: requests } = api.requests.getMyRequests.useQuery();
  //you can access all of the request details with selectedRequest
  const [selectedRequest, setSelectedRequest] =
    useState<DetailedRequest | null>(null);

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
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
          <SimiliarProperties
            location={selectedRequest!.location}
            city={selectedRequest!.location}
          />
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
