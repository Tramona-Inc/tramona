import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import { RequestCards } from "./RequestCards";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";
import RequestEmptySvg from "../_common/EmptyStateSvg/RequestEmptySvg";
import SimiliarProperties from "./SimilarProperties";
import { useState } from "react";
import { type DetailedRequest } from "@/components/requests/RequestCard";
import { useIsMd } from "@/utils/utils";
import { NewCityRequestBtn } from "./NewCityRequestBtn";

export default function CityRequestsTab() {
  const isMobile = !useIsMd();

  const { data: requests } = api.requests.getMyRequests.useQuery();
  //you can access all of the request details with selectedRequest
  const [selectedRequest, setSelectedRequest] =
    useState<DetailedRequest | null>(null);

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <div>
      {isMobile && (
        <p className="my-5 flex w-11/12 px-4 text-sm md:hidden">
          Submit bids while waiting for your request to increase your chance of
          getting a great deal.
        </p>
      )}
      <div className="flex h-screen-minus-header gap-8">
        <div className="flex-1 overflow-y-auto">
          <NewCityRequestBtn />
          <RequestCards
            requestGroups={requests.activeRequestGroups}
            selectedRequest={selectedRequest}
            setSelectedRequest={setSelectedRequest}
          />
        </div>
        {!isMobile && (
          <div className="flex-1">
            {selectedRequest?.location ? (
              <SimiliarProperties
                location={selectedRequest.location}
                city={selectedRequest.location}
              />
            ) : (
              <Spinner />
            )}
          </div>
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
