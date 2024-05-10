import Head from "next/head";
import { useMemo } from "react";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import PastTrips from "@/components/my-trips/PastTrips";
import UpcomingTrips, {
  UpcomingTrip,
} from "@/components/my-trips/UpcomingTrips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { api, RouterOutputs } from "@/utils/api";

type MyTripsType<T> = T extends (infer U)[] ? U : never;

export type AcceptedBids = MyTripsType<
  RouterOutputs["myTrips"]["getAcceptedBids"]
>;

export type AcceptedTrips = MyTripsType<
  RouterOutputs["myTrips"]["getUpcomingTrips"]
>;

const transformBookedTrips = (trip: AcceptedTrips): UpcomingTrip => {
  return {
    id: trip.id,
    request: {
      checkIn: new Date(trip.request.checkIn),
      checkOut: new Date(trip.request.checkOut),
    },
    property: {
      name: trip.property.name,
      imageUrls: trip.property.imageUrls,
      address: trip.property.address,
      host: {
        name: trip.property.host?.name ?? "",
        image: trip.property.host?.image ?? "",
      },
    },
  };
};

const transformAcceptedBids = (trip: AcceptedBids): UpcomingTrip => {
  return {
    id: trip.property.id,
    request: {
      checkIn: new Date(trip.checkIn),
      checkOut: new Date(trip.checkOut),
    },
    property: {
      name: trip.property.name,
      imageUrls: trip.property.imageUrls,
      address: trip.property.address,
      host: {
        name: trip.property.host?.name ?? "",
        image: trip.property.host?.image ?? "",
      },
    },
  };
};

export default function MyTrips() {
  const date = useMemo(() => new Date(), []); // useMemo from React

  const { data: trips, isLoading: loadingTrips } =
    api.myTrips.getUpcomingTrips.useQuery({ date });
  const { data: pastTrips, isLoading: loadingPastTrips } =
    api.myTrips.getPreviousTrips.useQuery({ date });

  const { data: acceptedBids, isLoading: loadingBids } =
    api.myTrips.getAcceptedBids.useQuery();

  // Transform accepted bids and trips
  const transformedTrips: UpcomingTrip[] = (trips ?? []).map(
    transformBookedTrips,
  );
  const transformedAcceptedBids: UpcomingTrip[] = (acceptedBids ?? []).map(
    transformAcceptedBids,
  );

  // Combine both transformed arrays
  const combinedTrips: UpcomingTrip[] = [
    ...transformedTrips,
    ...transformedAcceptedBids,
  ];

  // Sort the combined array based on dates
  combinedTrips.sort((a, b) => Number(a.request.checkIn) - Number(b.request.checkIn));

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>

      <div className="container col-span-10 flex min-h-screen-minus-header flex-col gap-10 py-10 2xl:col-span-11">
        <h1 className="text-4xl font-bold">My Trips</h1>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger
              value="upcoming"
              className="px-4 text-lg data-[state=active]:border-b-4 data-[state=active]:border-b-black data-[state=active]:font-bold"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="px-4 text-lg data-[state=active]:border-b-4 data-[state=active]:border-b-black data-[state=active]:font-bold"
            >
              History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 gap-3 pt-8 md:gap-5 lg:gap-8">
              <UpcomingTrips trips={combinedTrips} isLoading={loadingTrips} />
            </div>
          </TabsContent>
          <TabsContent value="history">
            <div className="grid grid-cols-1 gap-3 pt-8 md:gap-5 lg:gap-8 xl:grid-cols-2">
              <PastTrips pastTrips={pastTrips} isLoading={loadingPastTrips} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
