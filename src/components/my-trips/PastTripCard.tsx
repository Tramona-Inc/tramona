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
      <div className="grid grid-cols-3 gap-4 p-4">
        {/* Left side - Image */}
        <div className="relative h-[200px] w-full">
          <Badge className="absolute left-3 top-3 bg-white font-medium">
            Past Trip
          </Badge>
          <Image
            src={trip.property.imageUrls[0]!}
            alt=""
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* Middle - Details */}
        <div className="col-span-2 flex flex-col justify-between">
          <div className="space-y-2">
            {/* Header with more options */}
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold">{trip.property.name}</h2>
            </div>

            {/* Host info */}
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Hosted by</span>
              <div className="flex items-center gap-2">
                <UserAvatar
                  name={trip.property.hostTeam.owner.name}
                  image={trip.property.hostTeam.owner.image}
                />
                <span>{trip.property.hostTeam.owner.name}</span>
              </div>
            </div>

            {/* Location and Dates */}
            <div className="grid grid-cols-2 gap-4">
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
          </div>

          {/* Check-in info and View more */}
          <div className="mt-3 space-y-4">
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

            <Link
              href={`/my-trips/${trip.id}?type=request`}
              className="mt-4 inline-flex items-center gap-1 text-primaryGreen hover:underline"
            >
              <span>View more details</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
