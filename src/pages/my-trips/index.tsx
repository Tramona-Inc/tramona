import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import PastTrips from "@/components/my-trips/PastTrips";
import UpcomingTrips from "@/components/my-trips/UpcomingTrips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, HistoryIcon } from "lucide-react";
import SuccessfulBookingDialog from "@/components/my-trips/SuccessfulBookingDialog";
import { useEffect, useMemo, useState } from "react";
import { api, type RouterOutputs } from "@/utils/api";
import Spinner from "@/components/_common/Spinner";
export type TripCardDetails = RouterOutputs["trips"]["getMyTrips"][number];

export default function MyTrips() {
  // booking and trip are the same thing
  const [open, setOpen] = useState(false);
  const [booking, setBooking] = useState<TripCardDetails | null>(null);
  const { data: allTrips } = api.trips.getMyTrips.useQuery();

  const { upcomingTrips, pastTrips } = useMemo(() => {
    if (!allTrips) return { upcomingTrips: [], pastTrips: [] };
    const now = new Date();
    return {
      upcomingTrips: allTrips.filter((trip) => trip.checkIn > now),
      pastTrips: allTrips.filter((trip) => trip.checkIn <= now),
    };
  }, [allTrips]);

  // find the last element in upcomingTrips array, which is the most recent booking. If it was created at is less than 15 seconds ago, show the dialog
  useEffect(() => {
    if (upcomingTrips.length > 0) {
      const mostRecentBooking = upcomingTrips[upcomingTrips.length - 1];
      const bookingTime = new Date(mostRecentBooking!.createdAt).getTime();
      const currentTime = new Date().getTime();
      if (mostRecentBooking && currentTime - bookingTime < 10000) {
        // 10 seconds
        setBooking(mostRecentBooking);
        setOpen(true);
      }
    }
  }, [upcomingTrips]);

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      <SuccessfulBookingDialog
        open={open}
        setOpen={setOpen}
        booking={booking}
      />

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
