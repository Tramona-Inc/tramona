import PreviousCard from "@/components/my-trips/PreviousCard";
import UpcomingCard from "@/components/my-trips/UpcomingCard";
import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { useMemo } from "react";

export default function MyTrips() {
  const date = useMemo(() => new Date(), []); // useMemo from React

  const { data, isLoading } = api.myTrips.mostRecentTrips.useQuery({
    date: date,
  });

  const upcomingTotal = data?.upcomingTrips.length;
  const previousTotal = data?.previousTrips.length;

  return (
    <div className="container flex flex-col gap-10 py-10">
      <h1 className="text-4xl font-bold">My Trips</h1>

      <div className="flex w-full flex-col gap-10 lg:flex-row">
        <div className="flex flex-col gap-8 lg:w-2/3">
          <h2 className="flex items-center text-2xl font-bold">
            Upcoming
            {!isLoading && (
              <span className="ml-2 rounded-full bg-zinc-200 px-3 py-0.5 text-sm font-semibold text-zinc-600">
                {upcomingTotal}
              </span>
            )}
          </h2>
          {isLoading ? (
            <>Loading ...</>
          ) : (
            <>
              {data && data.upcomingTrips.length > 0 ? (
                data?.upcomingTrips.map((trip) => {
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
          <h2 className="flex items-center text-2xl font-bold">
            Previous
            {!isLoading && (
              <span className="ml-2 rounded-full bg-zinc-200 px-3 py-0.5 text-sm font-semibold text-zinc-600">
                {previousTotal}
              </span>
            )}
          </h2>
          <div className="flex flex-col gap-5 md:grid md:grid-cols-2 lg:flex lg:flex-col">
            {isLoading ? (
              <>Loading ...</>
            ) : (
              <>
                {data && data.previousTrips.length > 0 ? (
                  data?.previousTrips.map((trip) => {
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
