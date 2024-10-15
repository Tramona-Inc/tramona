import { type RouterOutputs } from "@/utils/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import {
  formatDateStringWithDayName,
  removeTimezoneFromDate,
} from "@/utils/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Define an enum for trip statuses
enum TripStatus {
  Booked = "Booked",
  Cancelled = "Cancelled",
  NeedsAttention = "Needs attention",
}

// Map trip statuses to colors
const tripStatusColorMap: Record<TripStatus, "green" | "red" | "yellow"> = {
  [TripStatus.Booked]: "green",
  [TripStatus.Cancelled]: "red",
  [TripStatus.NeedsAttention]: "yellow",
};

type Trip = RouterOutputs["trips"]["getAllPreviousTripsWithDetails"][number];

export default function TripCard({ trip }: { trip: Trip }) {
  const tripStatus = trip.tripsStatus ?? TripStatus.Booked; // Default to Booked if status is undefined
  const statusColor = tripStatusColorMap[tripStatus as TripStatus]; // Fallback color
  const tripDuration = dayjs(trip.checkOut).diff(trip.checkIn, "day");

  return (
    <Card className="my-6 h-auto w-full max-w-sm whitespace-nowrap border-2">
      <CardHeader>
        <CardTitle className="flex justify-between">
          {/* <RequestGroupAvatars
            request={trip.offer?.request.}
            isAdminDashboard="admin"
          /> */}
          {trip.group.owner.name}
          <Badge variant={statusColor}>{tripStatus}</Badge>
        </CardTitle>
        <div className="text-sm font-semibold">- {trip.property.city}</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-light tracking-tighter">
            {formatDateStringWithDayName(removeTimezoneFromDate(trip.checkIn))}{" "}
            -{" "}
            {formatDateStringWithDayName(removeTimezoneFromDate(trip.checkOut))}
          </p>
          <p>In {tripDuration} days</p>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/my-trips/${trip.id}`}>
          <Button>Show Trip</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
