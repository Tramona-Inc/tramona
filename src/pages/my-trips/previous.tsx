import PreviousCard from "@/components/my-trips/PreviousCard";
import { api } from "@/utils/api";
import { formatDateRange } from "@/utils/utils";
import { useMemo } from "react";

export default function Previous() {
  const date = useMemo(() => new Date(), []); // useMemo from React

  const { data, isLoading } = api.myTrips.getPreviousTrips.useQuery({
    date: date,
  });

  return (
    <div className="container flex flex-col gap-10 py-10">
      <h1 className="text-4xl font-bold">Upcoming</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {isLoading ? (
          <>Loading ...</>
        ) : (
          <>
            {data && data.length > 0 ? (
              data?.map((trip) => {
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
              <h1>No upcoming trips</h1>
            )}
          </>
        )}
      </div>
    </div>
  );
}
