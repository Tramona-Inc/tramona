import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";
import UpcomingTripCard from "@/components/my-trips/UpcomingTripCard";
import { type TripCardDetails } from "@/pages/my-trips";
import { CalendarClockIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

export default function TripsTab({
  trips,
  type,
}: {
  trips: TripCardDetails[];
  type: "upcoming" | "current";
}) {
  return (
    <div className="mt-3 flex flex-col gap-y-3">
      <Link href="/unclaimed-offers">
        <Button variant="primary" className="max-w-fit">
          <SearchIcon className="size-5 -ml-1" />
          Plan Another Trip
        </Button>
      </Link>
      <Alert className="bg-white">
        <CalendarClockIcon className="h-4 w-4" />
        <AlertTitle>
          {type === "upcoming" ? "Upcoming Adventures" : "Active Trips"}
        </AlertTitle>
        <AlertDescription>
          {type === "upcoming"
            ? "Get ready for your future stays. ALL your upcoming bookings appear here."
            : "These are your ongoing trips. Enjoy your stay"}
        </AlertDescription>
      </Alert>
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pt-4 xl:grid-cols-2">
          {trips.map((trip) => (
            <UpcomingTripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <EmptyStateValue
          title="You have no upcoming trips"
          description="Once you've booked a property, your trips will show up here."
          redirectTitle="Start Searching"
          href="/"
        >
          <MyTripsEmptySvg />
        </EmptyStateValue>
      )}
    </div>
  );
}
