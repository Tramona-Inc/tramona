import Spinner from "@/components/_common/Spinner";
import UpcomingCard from "@/components/my-trips/UpcomingCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { api } from "@/utils/api";
import { cn, formatDateRange } from "@/utils/utils";
import Link from "next/link";
import { useMemo } from "react";

export default function Upcoming() {
  const date = useMemo(() => new Date(), []); // useMemo from React

  const { data, isLoading } = api.myTrips.getUpcomingTrips.useQuery({
    date: date,
  });

  return (
    <div className="flex-start container flex flex-col gap-10 py-10">
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
      <h1 className="text-4xl font-bold">Upcoming</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {isLoading ? (
          <Spinner />
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
              <div className="flex h-full flex-col items-center justify-center gap-5">
                <h1 className="text-2xl font-bold">No upcoming trips</h1>
                <Button variant={"darkOutline"} asChild>
                  <Link href={"/requests"}>Book some trips!</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
