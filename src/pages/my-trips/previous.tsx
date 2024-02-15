import PreviousCard from "@/components/my-trips/PreviousCard";
import { buttonVariants } from "@/components/ui/button";
import { api } from "@/utils/api";
import { cn, formatDateRange } from "@/utils/utils";
import Link from "next/link";
import { useMemo } from "react";

export default function Previous() {
  const date = useMemo(() => new Date(), []); // useMemo from React

  const { data, isLoading } = api.myTrips.getPreviousTrips.useQuery({
    date: date,
  });

  return (
    <div className="container flex flex-col gap-10 py-10">
      <div>
        <Link
          href={"/my-trips"}
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "rounded-full",
          )}
        >
          &larr; Back to my trips
        </Link>
      </div>
      <h1 className="text-4xl font-bold">Previous</h1>

      <div className="grid gap-8 lg:grid-cols-2">
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
