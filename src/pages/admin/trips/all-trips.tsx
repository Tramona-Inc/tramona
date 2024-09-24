import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { api } from "@/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreviousTrips } from "@/components/admin/trips/TripFeed";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="items-around mx-20 my-8 flex w-5/6 flex-col justify-center">
        <h1 className="mx-10 text-3xl font-bold">Trips</h1>
        <Tabs>
          <TabsList>
            <TabsTrigger value="current-trips">Current Trips</TabsTrigger>
            <TabsTrigger value="upcoming-trips">Upcoming Trips</TabsTrigger>
            <TabsTrigger value="previous-trips">Previous Trips</TabsTrigger>
          </TabsList>
          <TabsContent value="current-trips"> </TabsContent>
          <TabsContent value="upcoming-trips"> </TabsContent>
          <TabsContent value="previous-trips">
            {" "}
            <PreviousTrips />{" "}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
