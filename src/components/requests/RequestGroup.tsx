import RequestCard, {
  type DetailedRequest,
} from "@/components/requests/RequestCard";
import { RequestCardAction } from "@/components/requests/RequestCardAction";
import { type RequestGroup } from "@/server/db/schema";
import { RequestUnconfirmedButton } from "./RequestUnconfirmedButton";
import { useEffect } from "react";

export default function RequestGroupCards({
  requestGroup,
  requests,
  isWaiting,
  startTimer,
  selectedRequest,
  setSelectedRequest,
}: {
  requestGroup: RequestGroup;
  requests: DetailedRequest[];
  isWaiting: boolean;
  startTimer: () => void;
  selectedRequest: DetailedRequest | null;
  setSelectedRequest: (request: DetailedRequest | null) => void;
}) {
  useEffect(() => {
    if (requests.length > 0) {
      setSelectedRequest(requests[0] ?? null);
    }
  }, []);
  if (requests.length === 0) return null;

  const requestUnconfirmedBtn = (
    <RequestUnconfirmedButton
      requestGroupId={requestGroup.id}
      isWaiting={isWaiting}
      onClick={startTimer}
    />
  );
  const handleCardClick = (request: DetailedRequest) => {
    setSelectedRequest(request);
  };

  if (requests.length === 1) {
    const request = requests[0]!;

    const isSelected = selectedRequest?.id === request.id;
    return (
      <div
        key={request.id}
        onClick={() => handleCardClick(request)}
        className={`min-w-96 cursor-pointer *:h-full ${isSelected ? "rounded-xl border border-primary" : ""}`}
      >
        {/* The is selected prop going inside of Request card is just for mobile desktop is handles in activeRequestGroup */}
        <RequestCard request={request} isSelected={isSelected}>
          {requestGroup.hasApproved ? (
            <RequestCardAction request={request} />
          ) : (
            requestUnconfirmedBtn
          )}
        </RequestCard>
      </div>
    );
  }

  return (
    <div className="col-span-full overflow-hidden rounded-xl bg-accent">
      <div className="flex items-center gap-2 px-4 pt-2">
        <p className="text-sm font-semibold uppercase text-zinc-600">
          {requests.length} Requests
        </p>
      </div>
      <div className="flex gap-2 overflow-x-auto p-2">
        {requests.map((request) => {
          const isSelected = selectedRequest?.id === request.id;
          return (
            <div
              key={request.id}
              onClick={() => handleCardClick(request)}
              className={`min-w-96 cursor-pointer *:h-full ${isSelected ? "rounded-xl border border-primary" : ""}`}
            >
              <RequestCard request={request}>
                <RequestCardAction request={request} />
              </RequestCard>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end gap-2 px-4 pb-2">
        {!requestGroup.hasApproved && requestUnconfirmedBtn}
      </div>
    </div>
  );
}
