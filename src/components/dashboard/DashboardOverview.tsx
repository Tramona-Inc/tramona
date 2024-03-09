import Link from "next/link";
import { useMemo } from "react";
import RequestCard, {
  type DetailedRequest,
} from "@/components/requests/RequestCard";
import { RequestCardAction } from "@/components/requests/RequestCardAction";
import Spinner from "../_common/Spinner";
import DesktopSearchBar from "../landing-page/SearchBar/DesktopSearchBar";

import { api } from "@/utils/api";
import { type UpcomingTrip } from "@/pages/my-trips";
import { formatDateRange } from "@/utils/utils";
import { Card, CardContent } from "../ui/card";
// import Image from "next/image";

function RequestCards({
  requests,
}: {
  requests: DetailedRequest[] | undefined;
}) {
  return requests ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request}>
          <RequestCardAction request={request} />
        </RequestCard>
      ))}
    </div>
  ) : (
    <Spinner />
  );
}

function UpcomingTrips({
  trips,
}: {
  trips: UpcomingTrip[] | null | undefined;
}) {
  return trips ? (
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
            alt="Property snapshot"
            fill
            className="bg-zinc-100"
            objectFit="contain"
          /> */}
          </Card>
        </Link>
      ))}
    </div>
  ) : (
    <Spinner />
  );
}

export default function DashboardOverview() {
  const date = useMemo(() => new Date(), []);

  const { data: requests } = api.requests.getMyRequests.useQuery();
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
            {requests?.activeRequests.length !== 0 ? (
              <RequestCards requests={requests?.activeRequests} />
            ) : (
              <p className="text-muted-foreground">You have no requests yet.</p>
            )}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-4 xl:col-span-3">
          <h2 className="text-3xl">Upcoming trips</h2>
          <div className="py-5">
            {trips?.length !== 0 ? (
              <UpcomingTrips trips={trips} />
            ) : (
              <p className="text-muted-foreground">You have no trips yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
