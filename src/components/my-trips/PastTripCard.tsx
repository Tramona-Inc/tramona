import Link from "next/link";
import { Badge } from "../ui/badge";
import UserAvatar from "../_common/UserAvatar";
import { Clock, MapPin, MoreVertical, ChevronRight } from "lucide-react";
import Image from "next/image";
import { type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { Button } from "../ui/button";

export default function PastTripCard({
  trip,
}: {
  trip: RouterOutputs["trips"]["getMyTrips"][number];
}) {
  return (
    <div className="w-full rounded-xl border border-zinc-200 shadow-md">
      <div className="flex flex-col md:grid md:grid-cols-3 md:gap-4 md:p-4">
        {/* Image section */}
        <div className="relative h-[160px] w-full md:h-[200px]">
          <Badge className="absolute left-3 top-3 bg-white text-xs font-medium md:text-sm">
            Past Trip
          </Badge>
          <Image
            src={trip.property.imageUrls[0]!}
            alt=""
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Details section */}
        <div className="col-span-2 flex flex-col justify-between p-3 md:p-0">
          <div className="space-y-2 md:space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold md:text-2xl">
                {trip.property.name}
              </h2>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">Hosted by</span>
              <div className="flex items-center gap-2">
                <UserAvatar
                  name={trip.property.hostTeam.owner.name}
                  image={trip.property.hostTeam.owner.image}
                  className="h-6 w-6 md:h-8 md:w-8"
                />
                <span className="text-sm md:text-base">
                  {trip.property.hostTeam.owner.name}
                </span>
              </div>
            </div>

            {/* Separator - visible only on mobile */}
            <div className="h-[1px] w-full bg-zinc-200 md:hidden" />

            {/* Location and Dates - desktop only */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold">Location</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primaryGreen" />
                  <span className="text-xs">{trip.property.address}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold">Dates</h3>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <Clock className="mt-1 h-4 w-4 text-primaryGreen" />
                  <div className="flex flex-col text-xs">
                    <span>
                      Check-in: {dayjs(trip.checkIn).format("MMM D, h:mm A")}
                    </span>
                    <span>
                      Check-out: {dayjs(trip.checkOut).format("MMM D, h:mm A")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip details - mobile only */}
            <div className="space-y-1 md:hidden">
              <h3 className="text-sm font-medium">Trip details</h3>
              <p className="text-sm text-muted-foreground">
                Check-in/Check-out: {dayjs(trip.checkIn).format("MMM D")} –{" "}
                {dayjs(trip.checkOut).format("D")}
              </p>
            </div>
          </div>

          {/* Check-in info - desktop only */}
          <div className="mt-3 hidden space-y-4 md:block">
            {trip.property.checkInTime && (
              <div className="rounded-lg bg-gray-100 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Check-in information arriving:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {dayjs(trip.checkIn)
                      .subtract(2, "day")
                      .format("MMM D, YYYY")}{" "}
                    at {dayjs(trip.checkIn).format("h:mm A")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* View more link */}
          <Link
            href={`/my-trips/${trip.id}?type=request`}
            className="mt-2 inline-flex items-center gap-1 text-sm text-primaryGreen underline md:mt-4 md:text-base md:no-underline"
          >
            <span>
              View more <span className="hidden md:inline">details</span>
            </span>
            <ChevronRight className=":h-4 hidden w-4 md:block" />
          </Link>
        </div>
      </div>
    </div>
  );
}
