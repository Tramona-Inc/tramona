import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import UserAvatar from "@/components/_common/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRight,
  Search,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import {
  formatCurrency,
  removeTimezoneFromDate,
  formatDateStringWithDayName,
  plural,
  convertTo12HourFormat,
  getDaysUntilTrip,
} from "@/utils/utils";

import SingleLocationMap from "../_common/GoogleMaps/SingleLocationMap";
import { api, type RouterOutputs } from "@/utils/api";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { useChatWithHost } from "@/utils/messaging/useChatWithHost";

export type TripWithDetails = RouterOutputs["trips"]["getMyTripsPageDetails"];
export type TripWithDetailsConfirmation =
  RouterOutputs["trips"]["getMyTripsPageDetailsByPaymentIntentId"];

dayjs.extend(relativeTime);

export default function TripPage({
  tripData,
}: {
  tripData: TripWithDetails | TripWithDetailsConfirmation;
  isConfirmation?: boolean;
}) {
  const chatWithHost = useChatWithHost();
  const { trip, coordinates } = tripData;
  const tripDuration = dayjs(trip.checkOut).diff(trip.checkIn, "day");
  const { data } = api.properties.getById.useQuery({ id: trip.propertyId });
  const hostId = data?.hostTeam.owner.id;

  return (
    <div className="mx-auto max-w-3xl space-y-6 bg-white p-4 py-6">
      <Button asChild size="icon" variant="ghost" className="rounded-full">
        <Link href={"/my-trips"}>
          <ArrowLeftIcon />
        </Link>
      </Button>

      <div className="space-y-3">
        {/* Main property image and booking status */}
        <div className="relative h-[200px] overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={trip.property.imageUrls[0]!}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center rounded-full bg-primaryGreen px-3 py-1 text-sm font-medium text-white">
              Booking confirmed
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
            <p className="text-sm">The countdown to your trip begins</p>
            <p className="text-2xl font-bold">
              {getDaysUntilTrip(trip.checkIn)} days to go
            </p>
          </div>
        </div>

        {/* Property title and host */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{trip.property.name}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hosted by</span>
              <div className="flex items-center gap-2">
                <UserAvatar
                  name={trip.property.hostTeam.owner.name}
                  image={
                    trip.property.hostTeam.owner.image ??
                    "/assets/images/tramona-logo.jpeg"
                  }
                />
                <span>{trip.property.hostTeam.owner.name ?? "Tramona"}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-primaryGreen"
              onClick={() => chatWithHost({ hostId: hostId! })}
            >
              <MessageCircle className="h-4 w-4 text-primaryGreen" />
              <span className="text-primaryGreen">Message your host</span>
            </Button>
          </div>
        </div>

        {/* Trip details */}
        <div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6">
          <div>
            <h2 className="text-lg font-semibold">Your trip</h2>
            <p className="text-sm text-muted-foreground">
              {plural(tripDuration, "night")} ·{" "}
              {plural(trip.numGuests, "guest")}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-semibold">
                {formatDateStringWithDayName(
                  removeTimezoneFromDate(trip.checkIn),
                )}
              </p>
              {trip.property.checkInTime && (
                <p className="text-sm">
                  {convertTo12HourFormat(trip.property.checkInTime)}
                </p>
              )}
            </div>
            <ArrowRight className="text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-semibold">
                {formatDateStringWithDayName(
                  removeTimezoneFromDate(trip.checkOut),
                )}
              </p>
              {trip.property.checkOutTime && (
                <p className="text-sm">
                  {convertTo12HourFormat(trip.property.checkOutTime)}
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-semibold">{trip.property.address}</p>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full justify-between border-primaryGreen"
          >
            <Link href={`/property/${trip.property.id}`}>
              <span className="text-primaryGreen">Show property details</span>
              <ChevronRight className="h-4 w-4 text-primaryGreen" />
            </Link>
          </Button>
        </div>

        {/* Map */}
        <div className="h-[300px] overflow-hidden rounded-lg">
          <SingleLocationMap
            lat={coordinates.location.lat}
            lng={coordinates.location.lng}
          />
        </div>

        {/* Payment info */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Payment info</h2>
          <div className="flex justify-between">
            <span className="font-semibold">Total cost</span>
            <div className="text-right">
              <p className="font-semibold">
                {formatCurrency(
                  trip.tripCheckout?.totalTripAmount ??
                    trip.totalPriceAfterFees,
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Paid {dayjs(trip.createdAt).format("MMM D")}
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        {trip.property.cancellationPolicy !== null && (
          <div className="rounded-lg border border-zinc-200 p-6">
            <h2 className="mb-4 text-lg font-semibold">Cancellation Policy</h2>
            <p className="text-sm text-muted-foreground">
              {getCancellationPolicyDescription(
                trip.property.cancellationPolicy,
              )}
            </p>
          </div>
        )}

        {/* Support */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Support</h2>
          <Button
            asChild
            variant="outline"
            className="w-full justify-between border-primaryGreen"
          >
            <Link href="/help-center ">
              <span className="text-primaryGreen">Get Help</span>
              <ChevronRight className="h-4 w-4 text-primaryGreen" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
