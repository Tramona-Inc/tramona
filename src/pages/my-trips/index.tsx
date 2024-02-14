import PreviousCard from "@/components/my-trips/PreviousCard";
import UpcomingCard from "@/components/my-trips/UpcomingCard";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { useMemo } from "react";

export default function MyTrips() {
  const date = useMemo(() => new Date(), []); // useMemo from React

  const { data, isLoading } = api.myTrips.mostRecentTrips.useQuery({
    date: date,
  });

  return (
    <div className="container flex flex-col gap-10 py-10">
      <h1 className="text-4xl font-bold">My Trips</h1>

      <div className="flex w-full flex-col gap-10 lg:flex-row">
        <div className="flex flex-col gap-8 lg:w-2/3">
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center">
              <h1 className="text-2xl font-bold">Upcoming</h1>
              {!isLoading && (
                <span className="ml-2 rounded-full bg-zinc-200 px-3 py-0.5 text-sm font-semibold text-zinc-600">
                  {data?.totalUpcomingTrips}
                </span>
              )}
            </div>

            <Button variant={"darkPrimary"}>View More ...</Button>
          </div>
          {isLoading ? (
            <>Loading ...</>
          ) : (
            <>
              {data && data.displayUpcomingTrips.length > 0 ? (
                data?.displayUpcomingTrips.map((trip) => {
                  return (
                    <UpcomingCard
                      key={trip.id}
                      name={trip.property.name}
                      offerId={trip.id}
                      hostName={trip.property.host?.name ?? ""}
                      hostImage={trip.property.host?.image ?? ""}
                      date={formatDateRange(
                        trip.request.checkIn,
                        trip.request.checkOut,
                      )}
                      address={trip.property.address ?? ""}
                      propertyImage={trip.property.imageUrls[0] ?? ""}
                    />
                  );
                })
              ) : (
                <h1>No upcoming trips</h1>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-8 lg:w-1/3">
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center">
              <h1 className="text-2xl font-bold">Previous</h1>
              {!isLoading && (
                <span className="ml-2 rounded-full bg-zinc-200 px-3 py-0.5 text-sm font-semibold text-zinc-600">
                  {data?.totalPreviousTrips}
                </span>
              )}
            </div>

            <Button variant={"darkPrimary"}>View More ...</Button>
          </div>
          <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
            {isLoading ? (
              <>Loading ...</>
            ) : (
              <>
                {data && data.displayPreviousTrips.length > 0 ? (
                  data?.displayPreviousTrips.map((trip) => {
                    return (
                      <PreviousCard
                        key={trip.id}
                        name={trip.property.name}
                        date={formatDateRange(
                          trip.request.checkIn,
                          trip.request.checkOut,
                        )}
                        image={trip.property.imageUrls[0] ?? ""}
                        offerId={trip.id}
                      />
                    );
                  })
                ) : (
                  <h1>No previous trips</h1>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
