import { type DetailedRequest } from "@/components/requests/RequestCard";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { useInterval } from "@/utils/useInterval";
import { usePrevious } from "@uidotdev/usehooks";
import RequestGroupCards from "./RequestGroup";
import { type RequestGroup } from "@/server/db/schema";

export function RequestCards({
  requestGroups,
  selectedRequest,
  setSelectedRequest,
}: {
  requestGroups: { group: RequestGroup; requests: DetailedRequest[] }[];
  selectedRequest: DetailedRequest | null;
  setSelectedRequest: (request: DetailedRequest | null) => void;
}) {
  const [isWaiting, setIsWaiting] = useState(false);
  const utils = api.useUtils();
  // const [selectedRequest, setSelectedRequest] =
  //   useState<DetailedRequest | null>(requestGroups[0]!.requests[0]!);
  // console.log("This is the first request group");
  // console.log(selectedRequest);
  // console.log("This is the selected request");
  // console.log(selectedRequest);

  const previousRequestGroups = usePrevious(requestGroups);
  const newlyApprovedRequestGroups =
    requestGroups && previousRequestGroups
      ? requestGroups.filter(
          ({ group }) =>
            group.hasApproved &&
            !previousRequestGroups.find(
              ({ group: group2 }) => group2?.id === group.id,
            )?.group.hasApproved,
        )
      : [];

  useEffect(() => {
    if (newlyApprovedRequestGroups.length > 0) {
      setIsWaiting(false);
    }
  }, [newlyApprovedRequestGroups.length]);

  // Start the interval to invalidate requests every 10 seconds
  useInterval(
    () => void utils.requests.getMyRequests.invalidate(),
    isWaiting ? 10 * 1000 : null,
  ); // 10 seconds

  function startTimer() {
    setIsWaiting(true);
    setTimeout(() => setIsWaiting(false), 3 * 60 * 1000); // 3 minutes
  }

  return (
    <div className="grid gap-4 lg:grid-cols-1">
      {requestGroups.map(({ group: requestGroup, requests }) => (
        <RequestGroupCards
          key={requestGroup.id}
          requestGroup={requestGroup}
          requests={requests}
          isWaiting={isWaiting}
          startTimer={startTimer}
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
        />
      ))}
    </div>
  );
}
