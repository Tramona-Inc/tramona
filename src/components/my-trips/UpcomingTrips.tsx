import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";
import Spinner from "@/components/_common/Spinner";
import UpcomingTripCard from "@/components/my-trips/UpcomingTripCard";
import { api, RouterOutputs } from "@/utils/api";
export type TripCardDetails = RouterOutputs["trips"]["getMyTrips"][number];

export default function UpcomingTrips({upcomingTrips}: {upcomingTrips: TripCardDetails[]}) {

  return upcomingTrips.length > 0 ? (
    <div className="grid grid-cols-1 gap-4 pt-8 xl:grid-cols-2">
      {upcomingTrips.map((trip: any) => (
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
  );
}
