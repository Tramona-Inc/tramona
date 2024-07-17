import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import PastTrips from "@/components/my-trips/PastTrips";
import UpcomingTrips from "@/components/my-trips/UpcomingTrips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, HistoryIcon } from "lucide-react";
import SuccessfulBookingDialog from "@/components/my-trips/SuccessfulBookingDialog";
import { useEffect, useState } from "react";
import { useSSE } from "@/hooks/useSSE";

export default function MyTrips() {
  const [open, setOpen] = useState(false);
  const booking = useSSE('@/pages/api/stripe-webhook'); 

  // useEffect(() => {
  //   if (booking) {
  //     setOpen(true);
  //   }
  // }, [booking]);
  useEffect(() => {
    console.log('Booking data received:', booking);
    if (booking) {
      console.log('Opening dialog');
      setOpen(true);
    }
  }, [booking]);


  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>
      <SuccessfulBookingDialog open={open} setOpen={setOpen} offer={booking}/>

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
          <TabsContent value="upcoming">
            <UpcomingTrips />
          </TabsContent>
          <TabsContent value="history">
            <PastTrips />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
