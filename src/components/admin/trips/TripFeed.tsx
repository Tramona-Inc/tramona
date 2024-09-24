import { api } from "@/utils/api";
import TripCard from "./TripCard";
import Spinner from "@/components/_common/Spinner";

export function PreviousTrips() {
  const { data: previousTrips } =
    api.trips.getAllPreviousTripsWithDetails.useQuery();
  console.log(previousTrips);
  return (
    <div>
      {previousTrips ? (
        previousTrips.map((trip, index) => <TripCard key={index} trip={trip} />)
      ) : (
        <Spinner />
      )}
    </div>
  );
}
