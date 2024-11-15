import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, PackageOpenIcon, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import Link from "next/link";
import { api } from "@/utils/api";
import Spinner from "../_common/Spinner";
import RequestToBookCard from "../requests-to-book/RequestToBookCard";
import { Card, CardContent } from "../ui/card";

function BidsTab() {
  const { data: requestsToBook, isLoading } =
    api.requestsToBook.getMyRequestsToBook.useQuery();

  return (
    <div className="flex flex-col gap-y-3">
      <Link href="/unclaimed-offers">
        <Button variant="primary" className="max-w-fit">
          <SearchIcon className="size-5 -ml-1" />
          Search for more properties
        </Button>
      </Link>
      <Alert className="bg-white">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          If one of your bids is accepted, it will be instantly booked and all
          other bids will be automatically withdrawn
        </AlertDescription>
      </Alert>
      {isLoading ? (
        <Spinner />
      ) : requestsToBook && requestsToBook.activeRequestsToBook.length > 0 ? (
        requestsToBook.activeRequestsToBook.map((requestToBook) => (
          <RequestToBookCard
            key={requestToBook.id}
            type="guest"
            requestToBook={requestToBook}
          >
            {/* <RequestCardAction request={requestToBook} /> */}
          </RequestToBookCard>
        ))
      ) : (
        <Card className="flex h-full items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <PackageOpenIcon className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Bids Yet
            </h3>
            <p className="mb-4 max-w-sm text-sm text-gray-500">
              You haven&apos;t made any bids on properties yet. Start exploring
              and find your perfect stay!
            </p>
            <Button asChild>
              <Link href="/unclaimed-offers">Explore Properties</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BidsTab;
