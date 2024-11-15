import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";
import PastTripCard from "@/components/my-trips/PastTripCard";
import { type TripCardDetails } from "@/pages/my-trips";
import { HistoryIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

export default function PastTrips({
  pastTrips,
}: {
  pastTrips: TripCardDetails[];
}) {
  return (
    <div className="mt-3 flex flex-col gap-y-3">
      <Link href="/unclaimed-offers">
        <Button variant="primary" className="max-w-fit">
          <SearchIcon className="size-5 -ml-1" />
          Book your next Adventure
        </Button>
      </Link>
      <Alert className="bg-white">
        <HistoryIcon className="h-4 w-4" />
        <AlertTitle>Travel Memories</AlertTitle>
        <AlertDescription>
          Browse through your past adventures and completed trips.
        </AlertDescription>
      </Alert>
      {pastTrips.length !== 0 ? (
        <div className="grid grid-cols-1 gap-4 py-4 xl:grid-cols-2">
          {pastTrips.map((trip) => (
            <PastTripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyStateValue
          title="You have no past trips"
          description="Trips you've completed will show up here."
          redirectTitle="Start Searching"
          href="/"
        >
          <MyTripsEmptySvg />
        </EmptyStateValue>
      )}
    </div>
  );
}
