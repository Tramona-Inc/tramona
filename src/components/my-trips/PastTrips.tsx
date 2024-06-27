import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";
import Spinner from "@/components/_common/Spinner";
import PastTripCard from "@/components/my-trips/PastTripCard";
import { api, type RouterOutputs } from "@/utils/api";

export type TripCardDetails = RouterOutputs["trips"]["getMyTrips"][number];

export default function PastTrips() {
  const { data: allTrips } = api.trips.getMyTrips.useQuery();
  if (allTrips === undefined) return <Spinner />;
  const pastTrips = allTrips.filter((trip) => trip.checkIn <= new Date());

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
