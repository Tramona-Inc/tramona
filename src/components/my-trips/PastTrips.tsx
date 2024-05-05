import Spinner from "@/components/_common/Spinner";
import PastTripCard from "@/components/my-trips/PastTripCard";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import MyTripsEmptySvg from "@/components/_common/EmptyStateSvg/MyTripsEmptySvg";

import { RouterOutputs } from "@/utils/api";

type MyTripsType<T> = T extends (infer U)[] ? U : never;

export type PastTrip = MyTripsType<
  RouterOutputs["myTrips"]["getPreviousTrips"]
>;

export default function PastTrips({
  pastTrips,
  isLoading,
}: {
  pastTrips: PastTrip[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {pastTrips && (
        <>
          {pastTrips.length !== 0 ? (
            <>
              {pastTrips.map((trip: PastTrip) => (
                <PastTripCard key={trip.id} trip={trip} />
              ))}
            </>
          ) : (
            <>
              <div className="col-span-2">
                <EmptyStateValue
                  title={"You have no past trips"}
                  description={
                    "properties you've booked previously will show up here."
                  }
                  redirectTitle={"Start Searching"}
                  href={"/"}
                >
                  <MyTripsEmptySvg />
                </EmptyStateValue>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
