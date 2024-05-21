import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import Spinner from "@/components/_common/Spinner";
import { RequestCards } from "@/components/requests/RequestCards";
import { api } from "@/utils/api";
import { DetailedRequest } from "./RequestCard";
import { useState } from "react";

export default function InactiveRequestGroups() {
  const [selectedRequest, setSelectedRequest] =
    useState<DetailedRequest | null>(null);
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.inactiveRequestGroups.length !== 0 ? (
    <RequestCards
      requestGroups={requests.inactiveRequestGroups}
      setSelectedRequest={setSelectedRequest}
      selectedRequest={selectedRequest}
    />
  ) : (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center">
        <EmptyStateValue
          title={"You have no history"}
          description={
            "You haven't made any request or offers. Completed requets will show up here."
          }
          redirectTitle={"Request Deal"}
          href={"/"}
        ></EmptyStateValue>
      </p>
    </div>
  );
}
