import { api } from "@/utils/api";
import TripCard from "./TripCard";
import Spinner from "@/components/_common/Spinner";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";

// ================ NEEEDDSSS SOOOO MUCH WORK THANK YOU ==========================
export function PreviousTrips() {
  const { data: previousTrips, isLoading } =
    api.trips.getAllPreviousTripsWithDetails.useQuery();
  console.log(previousTrips);
  return (
    <div>
      {previousTrips ? (
        previousTrips.map((trip, index) => <TripCard key={index} trip={trip} />)
      ) : isLoading ? (
        <Spinner />
      ) : (
        <EmptyStateValue title="No Previous Trips" />
      )}
    </div>
  );
}

export function UpcomingTrips() {
  const { data: previousTrips, isLoading } =
    api.trips.getAllPreviousTripsWithDetails.useQuery();
  console.log(previousTrips);
  return (
    <div>
      {previousTrips ? (
        previousTrips.map((trip, index) => <TripCard key={index} trip={trip} />)
      ) : isLoading ? (
        <Spinner />
      ) : (
        <EmptyStateValue title="No Upcoming Trips" />
      )}
    </div>
  );
}

export function CurrentTrips() {
  const { data: previousTrips, isLoading } =
    api.trips.getAllPreviousTripsWithDetails.useQuery();
  console.log(previousTrips);
  return (
    <div>
      {previousTrips ? (
        previousTrips.map((trip, index) => <TripCard key={index} trip={trip} />)
      ) : isLoading ? (
        <Spinner />
      ) : (
        <EmptyStateValue title="No Current Trips" />
      )}
    </div>
  );
}
