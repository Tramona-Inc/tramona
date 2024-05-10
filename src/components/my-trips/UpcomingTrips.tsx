import Spinner from "@/components/_common/Spinner";
import UpcomingTripCard from "@/components/my-trips/UpcomingTripCard";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";

import { RouterOutputs } from "@/utils/api";

type MyTripsType<T> = T extends (infer U)[] ? U : never;

export type UpcomingTrip = MyTripsType<
  RouterOutputs["myTrips"]["getUpcomingTrips"]
>;

export default function UpcomingTrips({
  trips,
  isLoading,
}: {
  trips: UpcomingTrip[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {trips && (
        <>
          {trips.length !== 0 ? (
            <>
              {trips.map((trip: UpcomingTrip) => (
                <UpcomingTripCard key={trip.id} trip={trip} />
              ))}
            </>
          ) : (
            <>
              <EmptyStateValue
                title={"You have no upcoming trips"}
                description={
                  "Once you've booked a property, your trips will show up here."
                }
                redirectTitle={"Start Searching"}
                href={"/"}
              >
                <MyTripsEmptySvg />
              </EmptyStateValue>
            </>
          )}
        </>
      )}
    </>
  );
}
