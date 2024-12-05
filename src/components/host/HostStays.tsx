import { api } from "@/utils/api";
import {
  BubbleTabs,
  BubbleTabsTrigger,
  BubbleTabsContent,
  BubbleTabsList,
} from "@/components/ui/bubble-tabs";
import HostStaysCards from "./HostStaysCards";
import { addWeeks, isSameDay } from "date-fns";

// ____ DOUBLES AS THE OVERVIEW AND PAGE _____
export default function HostStays() {
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
    <div className="w-full">
      <h1 className="mb-2 text-3xl font-semibold md:mb-7 md:text-4xl">Stays</h1>
      <BubbleTabs defaultValue="currently-hosting">
        <BubbleTabsList className="mb-4">
          <BubbleTabsTrigger value="currently-hosting">
            Currently hosting
          </BubbleTabsTrigger>
          <BubbleTabsTrigger value="checking-out">
            Checking out
          </BubbleTabsTrigger>
          <BubbleTabsTrigger value="upcoming">Upcoming</BubbleTabsTrigger>
          <BubbleTabsTrigger value="accepted">Accepted</BubbleTabsTrigger>
          <BubbleTabsTrigger value="history">History</BubbleTabsTrigger>
          <div className="w-5/6 border-b-4" />
        </BubbleTabsList>
        <BubbleTabsContent value="currently-hosting">
          <HostStaysCards trips={currentlyHostingTrips} />
        </BubbleTabsContent>
        <BubbleTabsContent value="upcoming">
          <HostStaysCards trips={upcomingTrips} />
        </BubbleTabsContent>
        <BubbleTabsContent value="accepted">
          <HostStaysCards trips={acceptedTrips} />
        </BubbleTabsContent>
        <BubbleTabsContent value="checking-out">
          <HostStaysCards trips={checkingOutTrips} />
        </BubbleTabsContent>

        <BubbleTabsContent value="history">
          <HostStaysCards trips={historyTrips} />
        </BubbleTabsContent>
      </BubbleTabs>
    </div>
  );
}
