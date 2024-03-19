import Link from "next/link";
import { useMemo } from "react";
import Spinner from "../_common/Spinner";
import DesktopSearchBar from "../landing-page/SearchBar/DesktopSearchBar";

import { api } from "@/utils/api";
import { type UpcomingTrip } from "@/pages/my-trips";
import { formatDateRange } from "@/utils/utils";
import { Card, CardContent } from "../ui/card";
import ActiveRequestGroups from "../requests/ActiveRequestGroups";

function UpcomingTrips({ trips }: { trips: UpcomingTrip[] }) {
  if (trips.length === 0) {
    return <p className="text-muted-foreground">You have no trips yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {trips.map((trip) => (
        <Link key={trip.id} href={`/listings/${trip.id}`}>
          <Card>
            <CardContent className="flex flex-col">
              <p>{trip.property.address}</p>
              <p className="text-muted-foreground">
                Hosted by {trip.property.host?.name}
              </p>
              <p className="text-muted-foreground">
                {formatDateRange(trip.request.checkIn, trip.request.checkOut)}
              </p>
            </CardContent>
            {/* <Image
            src={trip.property.imageUrls[0]!}
            alt=""
            fill
            className="bg-zinc-100"
            objectFit="contain"
          /> */}
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  const date = useMemo(() => new Date(), []);

  const { data: trips } = api.myTrips.getUpcomingTrips.useQuery({
    date: date,
  });

  return (
    <div className="col-span-10 2xl:col-span-11">
      <div className="bg-zinc-700 px-10 py-10 xl:px-20 2xl:px-32">
        <h1 className="pb-5 text-center text-4xl font-bold text-white">
          Traveling? Submit a request now!
        </h1>
        <DesktopSearchBar />
      </div>

      <div className="grid grid-cols-1 gap-5 px-10 py-10 lg:grid-cols-10 xl:px-20 2xl:px-32">
        <div className="col-span-1 lg:col-span-6 xl:col-span-7">
          <h2 className="text-3xl">Requests/offers</h2>
          <div className="py-5">
            <ActiveRequestGroups />
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4 xl:col-span-3">
          <h2 className="text-3xl">Upcoming trips</h2>
          <div className="py-5">
            {trips ? <UpcomingTrips trips={trips} /> : <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
}
