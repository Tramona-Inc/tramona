import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, PackageOpenIcon, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import TravelerRequestToBookCard from "../requests-to-book/TravelerRequestToBookCard";
import EmptyStateValue from "../_common/EmptyStateSvg/EmptyStateValue";

function BidsTab() {
  const { data: requestsToBook, isLoading } =
    api.requestsToBook.getMyRequestsToBook.useQuery();

  return (
    <div className="flex flex-col gap-y-3">
      <Link href="/">
        <Button variant="primary" className="max-w-fit">
          <SearchIcon className="-ml-1 size-5" />
          Search for more properties
        </Button>
      </Link>
      <Alert className="">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          If one of your bids is accepted, it will be instantly booked and all
          other bids will be automatically withdrawn.
        </AlertDescription>
      </Alert>
      {isLoading ? (
        <Spinner />
      ) : requestsToBook && requestsToBook.activeRequestsToBook.length > 0 ? (
        requestsToBook.activeRequestsToBook.map((requestToBook) => (
          <TravelerRequestToBookCard
            key={requestToBook.id}
            type="guest"
            requestToBook={requestToBook}
          >
            {/* <RequestCardAction request={requestToBook} /> */}
          </TravelerRequestToBookCard>
        ))
      ) : (
        <EmptyStateValue
          title={"No bids yet"}
          description={
            "You haven't made any bids on properties yet. Start exploring and find your perfect stay!"
          }
          redirectTitle={"Explore Properties"}
          href={"/"}
        >
          <PackageOpenIcon className="mb-4 h-28 w-28 text-gray-400" />
        </EmptyStateValue>
      )}
    </div>
  );
}

export default BidsTab;
