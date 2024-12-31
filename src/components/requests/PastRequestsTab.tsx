import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import Spinner from "@/components/_common/Spinner";
import { api } from "@/utils/api";
import RequestCard from "./RequestCard";
import { RequestCardAction } from "./RequestCardAction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import TravelerRequestToBookCard from "../requests-to-book/TravelerRequestToBookCard";

export default function PastRequestsTab() {
  const { data: requests } = api.requests.getMyRequests.useQuery();
  const { data: requestsToBook } =
    api.requestsToBook.getMyRequestsToBook.useQuery();

  if (!requests) return <Spinner />;

  return requests.inactiveRequests.length !== 0 ||
    requestsToBook?.inactiveRequestsToBook.length !== 0 ? (
    <div className="space-y-3 pb-32">
      <Link href="/">
        <Button variant="primary" className="max-w-fit">
          <PlusIcon className="size-5 -ml-1" />
          Make Another Trip
        </Button>
      </Link>
      <Alert className="bg-white">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          This is where past accepted bids and requests show up. Check &quot;My
          Trips&quot; for upcoming details.
        </AlertDescription>
      </Alert>
      {requestsToBook?.inactiveRequestsToBook.map((requestToBook) => (
        <TravelerRequestToBookCard
          key={requestToBook.id}
          type="guest"
          requestToBook={requestToBook}
        ></TravelerRequestToBookCard>
      ))}
      {requests.inactiveRequests.map((request) => (
        <RequestCard key={request.id} type="guest" request={request}>
          <RequestCardAction request={request} />
        </RequestCard>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center">
        <EmptyStateValue
          title={"You have no history"}
          description={
            "You haven't made any request or offers. Completed requests will show up here."
          }
          redirectTitle={"Request Deal"}
          href={"/"}
        />
      </p>
    </div>
  );
}
