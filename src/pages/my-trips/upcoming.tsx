import UpcomingCard from "@/components/my-trips/UpcomingCard";
import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { useMemo } from "react";

export default function Upcoming() {
  const date = useMemo(() => new Date(), []); // useMemo from React

  const { data, isLoading } = api.myTrips.getUpcomingTrips.useQuery({
    date: date,
  });

  return (
    <div className="container flex flex-col gap-10 py-10">
      <h1 className="text-4xl font-bold">Upcoming</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {isLoading ? (
          <>Loading ...</>
        ) : (
          <>
            {data && data.length > 0 ? (
              data?.map((trip) => {
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
    </div>
  );
}
