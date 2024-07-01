import Head from "next/head";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import PastTrips from "@/components/my-trips/PastTrips";
import UpcomingTrips from "@/components/my-trips/UpcomingTrips";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseIcon, HistoryIcon } from "lucide-react";

export default function MyTrips() {
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
