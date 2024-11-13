import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import UserAvatar from "@/components/_common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRight,
  Check,
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

// Plugin for relative time
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
    <div className="col-span-10 flex flex-col gap-5 p-4 py-10 2xl:col-span-11">
      <Button asChild size="icon" variant="ghost" className="rounded-full">
        <Link href={"/my-trips"}>
          <ArrowLeftIcon />
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <div className="relative h-96 overflow-clip rounded-xl">
            <Image
              src={trip.property.imageUrls[0]!}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover"
            />
            {/* <Badge
              variant="lightZinc"
              className="absolute right-4 top-4 font-bold"
            >
              <Images className="mx-1 w-4" /> Show all photos
            </Badge> */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black"></div>
            <div className="absolute bottom-5 left-4 text-white">
              <p className="text-base font-semibold lg:text-lg">
                The countdown to your trip begins
              </p>
              <p className="text-3xl font-bold">
                {getDaysUntilTrip(trip.checkIn)} days to go
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-8">
            <div>
              <h1 className="text-3xl font-bold">{trip.property.name}</h1>
              <div className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <UserAvatar
                    name={trip.property.hostTeam.owner.name}
                    image={
                      trip.property.hostTeam.owner.image ??
                      "/assets/images/tramona-logo.jpeg"
                    }
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p>{trip.property.hostTeam.owner.name ?? "Tramona"}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-[160px] text-xs lg:w-[200px] lg:text-sm"
                  disabled={!hostId}
                  onClick={() => chatWithHost({ hostId: hostId! })}
                >
                  <MessageCircle className="w-4 lg:w-5" /> Message your host
                </Button>
              </div>
            </div>

            <div className="h-[2px] rounded-full bg-zinc-200"></div>

            <div>
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold">Your trip</h2>
                <Badge variant="green">
                  <Check className="w-4" />
                  Booking confirmed
                </Badge>
              </div>
              <p>
                <span>{plural(tripDuration, "night")}</span> ·{" "}
                <span>{plural(trip.numGuests, "guest")}</span>
              </p>

              <div className="flex items-center justify-between py-5">
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Check-in
                  </p>
                  <p className="text-lg font-bold">
                    {formatDateStringWithDayName(
                      removeTimezoneFromDate(trip.checkIn),
                    )}
                  </p>
                  <p className="font-semibold">
                    {trip.property.checkInTime && (
                      <p className="font-semibold">
                        {convertTo12HourFormat(trip.property.checkInTime)}
                      </p>
                    )}
                  </p>
                </div>
                <ArrowRight />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Check-out
                  </p>
                  <p className="text-lg font-bold">
                    {formatDateStringWithDayName(
                      removeTimezoneFromDate(trip.checkOut),
                    )}
                  </p>
                  {trip.property.checkOutTime && (
                    <p className="font-semibold">
                      {convertTo12HourFormat(trip.property.checkOutTime)}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold">{trip.property.address}</p>
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="flex flex-col lg:hidden">
                <p className="pb-2 pt-5 text-xl font-bold">Getting there</p>
                {/* <p>1234 Sunshine Blvd</p>
                <p>Los Angeles, CA, USA</p> */}
                <p>{trip.property.address}</p>

                <div className="relative z-10 my-3 overflow-clip rounded-lg">
                  <SingleLocationMap
                    lat={coordinates.location.lat}
                    lng={coordinates.location.lng}
                  />
                </div>
              </div>
              <Link
                href={`/property/${trip.property.id}`}
                className="flex justify-between pb-5 pt-3 font-semibold hover:underline lg:pt-5"
              >
                Show property details <ChevronRight />
              </Link>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div>
                <p className="pb-2 pt-5 text-xl font-bold">Payment info</p>
                <div className="flex justify-between">
                  <p className="font-bold">Total cost</p>
                  <p className="text-sm text-muted-foreground">
                    Paid {dayjs(trip.createdAt).format("MMM D")}
                  </p>
                </div>
                <p>
                  {formatCurrency(
                    trip.tripCheckout?.totalTripAmount ??
                      trip.totalPriceAfterFees,
                  )}
                </p>

                {/* <Link
                  href={`/`}
                  className="flex justify-between py-5 font-semibold hover:underline"
                >
                  View payment details <ChevronRight />
                </Link> */}
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="py-5">
                {trip.property.checkInInfo && (
                  <>
                    <p className="pb-2 font-bold">Check-in info</p>
                    <p>{trip.property.checkInInfo}</p>
                  </>
                )}

                {trip.property.cancellationPolicy !== null && (
                  <>
                    <p className="pb-2 font-bold">Cancellation Policy</p>
                    <p>
                      {getCancellationPolicyDescription(
                        trip.property.cancellationPolicy,
                      )}
                    </p>
                  </>
                )}
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="pt-5">
                <p className="pb-3 font-bold">Support</p>

                <Link
                  href={"/help-center"}
                  className="flex justify-between pb-3 pt-5 font-semibold hover:underline"
                >
                  Get Help <ChevronRight />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky top-[100px] z-10 hidden h-[700px] overflow-clip rounded-lg lg:block">
          <SingleLocationMap
            lat={coordinates.location.lat}
            lng={coordinates.location.lng}
          />
        </div>
      </div>
    </div>
  );
}
