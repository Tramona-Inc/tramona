import { api } from "@/utils/api";
import {
  BubbleTabs,
  BubbleTabsTrigger,
  BubbleTabsContent,
  BubbleTabsList,
} from "@/components/ui/bubble-tabs";
import HostStaysCards from "../HostStaysCards";
import { addWeeks, isSameDay } from "date-fns";

// ____ Overview page _____
export default function HostStaysOverview() {
  const { data: allTrips } = api.trips.getHostTrips.useQuery();

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
    <div className="flex flex-col gap-y-5">
      <h2 className="text-4xl font-bold">Your reservations</h2>
      <BubbleTabs defaultValue="currently-hosting" className="w-full">
        <BubbleTabsList className="flex w-full flex-row justify-start overflow-x-auto px-1">
          <BubbleTabsTrigger value="currently-hosting">
            Currently hosting
          </BubbleTabsTrigger>
          <BubbleTabsTrigger value="checking-out">
            Checking out
          </BubbleTabsTrigger>
          <BubbleTabsTrigger value="upcoming">Upcoming</BubbleTabsTrigger>
          <BubbleTabsTrigger value="accepted">Accepted</BubbleTabsTrigger>
          <BubbleTabsTrigger value="history">History</BubbleTabsTrigger>
        </BubbleTabsList>
        <BubbleTabsContent value="currently-hosting">
          <HostStaysCards
            trips={currentlyHostingTrips}
            staysTab="currently-hosting"
          />
        </BubbleTabsContent>
        <BubbleTabsContent value="upcoming">
          <HostStaysCards trips={upcomingTrips} staysTab="upcoming" />
        </BubbleTabsContent>
        <BubbleTabsContent value="accepted">
          <HostStaysCards trips={acceptedTrips} staysTab="accepted" />
        </BubbleTabsContent>
        <BubbleTabsContent value="checking-out">
          <HostStaysCards trips={checkingOutTrips} staysTab="checking-out" />
        </BubbleTabsContent>

        <BubbleTabsContent value="history">
          <HostStaysCards trips={historyTrips} staysTab="history" />
        </BubbleTabsContent>
      </BubbleTabs>
    </div>
  );
}
