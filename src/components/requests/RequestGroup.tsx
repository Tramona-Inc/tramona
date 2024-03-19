import RequestCard, {
  type DetailedRequest,
} from "@/components/requests/RequestCard";
import { RequestCardAction } from "@/components/requests/RequestCardAction";

export default function RequestGroup({
  groupId: _, // well use it soon
  requests,
  isWaiting,
  startTimer,
}: {
  groupId: number;
  requests: DetailedRequest[];
  isWaiting: boolean;
  startTimer: () => void;
}) {
  if (requests.length === 0) return null;

  if (requests.length === 1) {
    const request = requests[0]!;
    return (
      <RequestCard request={request}>
        <RequestCardAction
          request={request}
          isWaiting={isWaiting}
          onClick={startTimer}
        />
      </RequestCard>
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
        {requests.map((request) => (
          <div key={request.id} className="min-w-96 *:h-full">
            <RequestCard request={request}>
              <RequestCardAction
                request={request}
                isWaiting={isWaiting}
                onClick={startTimer}
              />
            </RequestCard>
          </div>
        ))}
      </div>
    </div>
  );
}
