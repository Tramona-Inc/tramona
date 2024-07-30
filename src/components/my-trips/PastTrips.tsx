import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";
import PastTripCard from "@/components/my-trips/PastTripCard";
import { type TripCardDetails } from "@/pages/my-trips";

export default function PastTrips({
  pastTrips,
}: {
  pastTrips: TripCardDetails[];
}) {
  return pastTrips.length !== 0 ? (
    <div className="grid grid-cols-1 gap-4 pt-8 xl:grid-cols-2">
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
  );
}
