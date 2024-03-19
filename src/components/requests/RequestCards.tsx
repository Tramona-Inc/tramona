import { type DetailedRequest } from "@/components/requests/RequestCard";
import { api } from "@/utils/api";
import { useEffect, useMemo, useState } from "react";
import { useInterval } from "@/utils/useInterval";
import { usePrevious } from "@uidotdev/usehooks";
import RequestGroup from "./RequestGroup";

export function RequestCards({
  requestGroups,
}: {
  requestGroups: { groupId: number; requests: DetailedRequest[] }[];
}) {
  const [isWaiting, setIsWaiting] = useState(false);
  const utils = api.useUtils();

  const requests = useMemo(
    () => requestGroups.map((group) => group.requests).flat(),
    [requestGroups],
  );

  const previousRequests = usePrevious(requests);
  const newlyApprovedRequests =
    requests && previousRequests
      ? requests.filter(
          (req) =>
            req.hasApproved &&
            !previousRequests.find((req2) => req2.id === req.id)?.hasApproved,
        )
      : [];

  useEffect(() => {
    if (newlyApprovedRequests.length > 0) {
      setIsWaiting(false);
    }
  }, [newlyApprovedRequests.length]);

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
    <div className="grid gap-4 lg:grid-cols-2">
      {requestGroups.map(({ groupId, requests }) => (
        <RequestGroup
          key={groupId}
          groupId={groupId}
          requests={requests}
          isWaiting={isWaiting}
          startTimer={startTimer}
        />
      ))}
    </div>
  );
}
