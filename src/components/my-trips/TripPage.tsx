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
  convertInteractionPreference,
  isTripWithin48Hours,
  isTrip5pmBeforeCheckout,
} from "@/utils/utils";

import SingleLocationMap from "../_common/GoogleMaps/SingleLocationMap";
import { api, type RouterOutputs } from "@/utils/api";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import { useChatWithHostTeam } from "@/utils/messaging/useChatWithHost";
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
  const chatWithHostTeam = useChatWithHostTeam();

  const { trip, coordinates } = tripData;

  const tripDuration = dayjs(trip.checkOut).diff(trip.checkIn, "day");
  const { data } = api.properties.getById.useQuery({ id: trip.propertyId });
  const hostId = data?.hostTeam.owner.id;

  const tripWithin48Hours = isTripWithin48Hours(tripData);

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
                  onClick={() =>
                    chatWithHostTeam({
                      hostId: hostId!,
                      hostTeamId: trip.property.hostTeam.id,
                      propertyId: trip.property.id,
                    })
                  }
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
                  <div>
                    {trip.property.checkInTime && (
                      <p className="font-semibold">
                        {convertTo12HourFormat(trip.property.checkInTime)}
                      </p>
                    )}
                  </div>
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

              <div className="py-4">
                <p className="font-bold">Payment info</p>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Total cost</p>
                  <p className="text-sm text-muted-foreground">
                    Paid {dayjs(trip.createdAt).format("MMM D")}
                  </p>
                </div>
                <p>
                  {formatCurrency(
                    trip.tripCheckout?.totalTripAmount ??
                      trip.travelerTotalPaidAmount,
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

              <div className="space-y-2 py-4">
                <p className="font-bold">Check-in info</p>
                {tripWithin48Hours ? (
                  <>
                    {trip.property.additionalCheckInInfo && (
                      <div className="flex items-center">
                        <div className="basis-1/2">
                          <p className="text-muted-foreground">Check-in type</p>
                          <p>{trip.property.checkInType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Additional check-in info
                          </p>
                          <p>{trip.property.additionalCheckInInfo}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <InfoReleased48HoursBeforeCheckIn />
                )}
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="space-y-2 py-4">
                <p className="font-bold">Check-out info</p>
                {isTrip5pmBeforeCheckout(tripData) ? (
                  <div className="flex items-center">
                    <div className="basis-1/2">
                      <p className="text-muted-foreground">Check-out type</p>
                      <p>{trip.property.checkOutInfo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Additional check-out info
                      </p>
                      <p>{trip.property.additionalCheckOutInfo}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    This information will be released at 5:00 PM before your
                    check-out date.
                  </p>
                )}
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="space-y-2 py-4">
                <p className="font-bold">House Rules</p>
                <div className="flex items-center">
                  <div className="basis-1/2">
                    <p className="text-muted-foreground">House Rules</p>
                    {trip.property.houseRules?.map((rule, index) => (
                      <p key={index}>{rule}</p>
                    ))}
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Additional house rules
                    </p>
                    <p>{trip.property.additionalHouseRules}</p>
                  </div>
                </div>
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="space-y-2 py-4">
                <p className="font-bold">Interaction preference</p>
                <p>
                  {convertInteractionPreference(
                    trip.property.interactionPreference,
                  )}
                </p>
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="space-y-2 py-4">
                <p className="font-bold">Directions</p>
                <p>{trip.property.directions}</p>
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="space-y-2 py-4">
                <p className="font-bold">Wifi details</p>
                {tripWithin48Hours ? (
                  <div className="flex items-center">
                    <div className="basis-1/2">
                      <p className="text-muted-foreground">Wifi name</p>
                      <p>{trip.property.wifiName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Wifi password</p>
                      <p>{trip.property.wifiPassword}</p>
                    </div>
                  </div>
                ) : (
                  <InfoReleased48HoursBeforeCheckIn />
                )}
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              <div className="space-y-2 py-4">
                <p className="font-bold">House Manual</p>
                {tripWithin48Hours ? (
                  <p>{trip.property.houseManual}</p>
                ) : (
                  <InfoReleased48HoursBeforeCheckIn />
                )}
              </div>

              <div className="h-[2px] rounded-full bg-zinc-200"></div>

              {trip.property.cancellationPolicy !== null && (
                <div className="space-y-2 py-4">
                  <p className="font-bold">Cancellation Policy</p>
                  <p>
                    {getCancellationPolicyDescription(
                      trip.property.cancellationPolicy,
                    )}
                  </p>
                </div>
              )}

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

function InfoReleased48HoursBeforeCheckIn() {
  return (
    <p className="text-muted-foreground">
      This information will be released 48 hours before your check-in date.
    </p>
  );
}
