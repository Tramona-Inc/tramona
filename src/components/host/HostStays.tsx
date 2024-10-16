import { api } from "@/utils/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HostStaysCards from "./HostStaysCards";
import { addWeeks, isSameDay } from "date-fns";

export default function HostStays() {
  const { data: allTrips = [] } = api.trips.getHostTrips.useQuery();

  const currentDate = new Date();
  const twoWeeksFromNow = addWeeks(currentDate, 2);

  // Upcoming trips within the next 2 weeks
  const upcomingTrips = allTrips?.filter(
    (trip) => trip.checkIn > currentDate && trip.checkIn <= twoWeeksFromNow,
  );

  // Accepted trips are those with offer and bid, starting after 2 weeks from now
  const acceptedTrips = allTrips?.filter(
    (trip) => trip.checkIn > twoWeeksFromNow,
  );

  // Trips that are checking out today
  const checkingOutTrips = allTrips?.filter((trip) =>
    isSameDay(trip.checkOut, currentDate),
  );

  // Past trips that have already ended
  const historyTrips = allTrips?.filter((trip) => trip.checkOut < currentDate);

  // Currently hosting trips including those ending today
  const currentlyHostingTrips = allTrips?.filter(
    (trip) => trip.checkIn <= currentDate && trip.checkOut >= currentDate,
  );
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold md:mb-10 md:text-4xl">Stays</h1>
      <Tabs defaultValue="currently hosting">
        <TabsList className="mb-4">
          <TabsTrigger value="currently hosting">Currently hosting</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="checking out">Checking out</TabsTrigger>
          <div className="w-5/6 border-b-4" />
          <div className="flex w-1/6 justify-end">
            <TabsTrigger value="history" className="w-full">
              History
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="currently hosting">
          <HostStaysCards trips={currentlyHostingTrips} />
        </TabsContent>
        <TabsContent value="upcoming">
          <HostStaysCards trips={upcomingTrips} />
        </TabsContent>
        <TabsContent value="accepted">
          <HostStaysCards trips={acceptedTrips} />
        </TabsContent>
        <TabsContent value="checking out">
          <HostStaysCards trips={checkingOutTrips} />
        </TabsContent>

        <TabsContent value="history">
          <HostStaysCards trips={historyTrips} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
