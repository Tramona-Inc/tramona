import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import PastTrips from "@/components/my-trips/PastTrips";
import UpcomingTrips from "@/components/my-trips/UpcomingTrips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, HistoryIcon } from "lucide-react";
import { useMemo } from "react";
import { api, type RouterOutputs } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";

export type TripCardDetails = RouterOutputs["trips"]["getMyTrips"][number];

export default function MyTrips() {
  const { data: allTrips } = api.trips.getMyTrips.useQuery();

  const { upcomingTrips, pastTrips } = useMemo(() => {
    if (!allTrips) return { upcomingTrips: [], pastTrips: [] };
    const now = new Date();
    return {
      upcomingTrips: allTrips.filter((trip) => trip.checkIn > now),
      pastTrips: allTrips.filter((trip) => trip.checkIn <= now),
    };
  }, [allTrips]);

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      <div className="container col-span-10 flex flex-col gap-10 py-10 pb-32 2xl:col-span-11">
        <h1 className="text-4xl font-bold">My Trips</h1>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">
              <BriefcaseIcon />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="history">
              <HistoryIcon />
              History
            </TabsTrigger>
          </TabsList>
          {allTrips === undefined ? (
            <Spinner />
          ) : (
            <>
              <TabsContent value="upcoming">
                <UpcomingTrips upcomingTrips={upcomingTrips} />
              </TabsContent>
              <TabsContent value="history">
                <PastTrips pastTrips={pastTrips} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
