import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useRouter } from "next/router";

import UserAvatar from "@/components/_common/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Check, ChevronRight, MessageCircle } from "lucide-react";

import { api } from "@/utils/api";
import { useChatWithAdmin } from "@/utils/useChatWithAdmin";
import { cn, formatCurrency, plural } from "@/utils/utils";
import { api, type RouterOutputs } from "@/utils/api";
import "leaflet/dist/leaflet.css";
import SingleLocationMap from "../_common/GoogleMaps/SingleLocationMap";

// Plugin for relative time
dayjs.extend(relativeTime);

type Trip = {
  id: number;
  property: {
    id: number;
    name: string;
    imageUrls: string[];
    address: string;
    checkInInfo: string | null;
    hostName: string | null;
    host: {
      image: string | null;
      name: string | null;
      id: string;
      email: string;
    } | null;
  };
  madeByGroup: {
    members: Object[];
  };
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  totalPrice: number;
  acceptedAt: Date | null;
  createdAt: Date | null;
  tramonaFee: number | null;
  location: string | null;
};

export default function TripPage({ trip }: { trip: Trip }) {
  const router = useRouter();

  const chatWithAdmin = useChatWithAdmin();

  const { data: coordinateData } = api.offers.getCoordinates.useQuery({
    location: trip.property.address,
  });

  const tripDuration = dayjs(trip.checkOut).diff(trip.checkIn, "day");

  return (
    <div className="container col-span-10 flex flex-col gap-5 py-10 2xl:col-span-11">
      <Link
        href={"/my-trips"}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-[170px] rounded-full font-bold",
        )}
      >
        &larr; Back to My Trips
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="overflow-clip rounded-lg bg-white">
          <div className="relative">
            <img
              src={trip.property.imageUrls[0]}
              width={700}
              height={400}
              className="w-full"
            />
            {/* <Badge
              variant="lightGray"
              className="absolute right-4 top-4 font-bold"
            >
              <Images className="mx-1 w-4" /> Show all photos
            </Badge> */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-black"></div>
            <div className="absolute bottom-8 left-5 text-white">
              <p className="text-base font-semibold lg:text-lg">
                The countdown to your trip begins
              </p>
              <p className="text-3xl font-bold">
                {dayjs(trip.checkIn).fromNow(true)} to go
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4">
            <div>
              <h1 className="text-3xl font-bold">{trip.property.name}</h1>
              <div className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <UserAvatar
                    name={trip.property.hostName}
                    // image={trip.property.host?.image}
                    image={
                      trip.property.host?.image ??
                      "/assets/images/tramona-logo.jpeg"
                    }
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p>
                      {trip.property.host?.name
                        ? trip.property.host.name
                        : "Tramona"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-[160px] text-xs lg:w-[200px] lg:text-sm"
                  onClick={() => chatWithAdmin()}
                >
                  <MessageCircle className="w-4 lg:w-5" /> Message your host
                </Button>
              </div>
            </div>

            <div className="h-[2px] rounded-full bg-gray-200"></div>

            <div>
              <div className="flex items-end justify-between">
                <h2 className="text-2xl font-bold">Your trip</h2>
                <Badge variant="green">
                  <Check className="w-4" />
                  Booking confirmed
                </Badge>
              </div>
              <p>
                <span>{plural(tripDuration, "night")}</span>
                <span className="mx-2">·</span>
                <span>{plural(trip.numGuests, "Adult")}</span>
              </p>

              <div className="flex items-center justify-between py-5">
                <div className="flex flex-col">
                  <p className="font-bold">Check-in</p>
                  <p className="text-lg font-bold">
                    {dayjs(trip.checkIn).format("ddd, MMM D")}
                  </p>
                  <p className="font-semibold">
                    {dayjs(trip.checkIn).format("h:mm a")}
                  </p>
                </div>
                <ArrowRight />
                <div className="flex flex-col">
                  <p className="font-bold">Check-out</p>
                  <p className="text-lg font-bold">
                    {dayjs(trip.checkOut).format("ddd, MMM D")}
                  </p>
                  <p className="font-semibold">
                    {dayjs(trip.checkOut).format("h:mm a")}
                  </p>
                </div>
              </div>

              <div className="h-[2px] rounded-full bg-gray-200"></div>

              <div className="flex flex-col lg:hidden">
                <p className="pb-2 pt-5 text-xl font-bold">Getting there</p>
                {/* <p>1234 Sunshine Blvd</p>
                <p>Los Angeles, CA, USA</p> */}
                <p>{trip.property.address}</p>

                {coordinateData && (
                  <div className="relative z-10 my-3 overflow-clip rounded-lg">
                    <SingleLocationMap
                      lat={coordinateData.coordinates.location!.lat}
                      lng={coordinateData.coordinates.location!.lng}
                    />
                  </div>
                )}
              </div>
              <Link
                href={`/property/${trip.property.id}`}
                className="flex justify-between pb-5 pt-3 font-semibold hover:underline lg:pt-5"
              >
                Show property details <ChevronRight />
              </Link>

              <div className="h-[2px] rounded-full bg-gray-200"></div>

              <div>
                <p className="pb-2 pt-5 text-xl font-bold">Payment info</p>
                <div className="flex justify-between">
                  <p className="font-bold">Total cost</p>
                  <p className="text-sm text-muted-foreground">
                    Paid {dayjs(trip.acceptedAt).format("MMM D")}
                  </p>
                </div>
                <p>{formatCurrency(trip.totalPrice)}</p>

                <Link
                  href={`/`}
                  className="flex justify-between py-5 font-semibold hover:underline"
                >
                  View payment details <ChevronRight />
                </Link>
              </div>

              <div className="h-[2px] rounded-full bg-gray-200"></div>

              <div className="py-5">
                {trip.property.checkInInfo && (
                  <>
                    <p className="pb-2 font-bold">Check-in info</p>
                    <p>{trip.property.checkInInfo}</p>
                  </>
                )}

                <p className="pb-2 font-bold">Cancelation Policy</p>

                <ol type="1" className="list-inside list-decimal">
                  <li>
                    Cancelation Period:
                    <ul className="list-inside list-disc">
                      <li>
                        Guests must notify us of any cancellation in writing
                        within the designated cancellation period.
                      </li>
                    </ul>
                  </li>

                  <li>
                    Cancellation Fees:
                    <ul className="list-inside list-disc">
                      <li>
                        If cancellation is made <strong>14 days</strong> or more
                        prior to the scheduled arrival date, guests will receive
                        a full refund of the booking deposit.
                      </li>
                      <li>
                        If cancellation is made within <strong>7 days</strong>{" "}
                        of the scheduled arrival date, guests will forfeit the
                        booking deposit.
                      </li>
                      <li>
                        In the event of a no-show or cancellation on the day of
                        check-in, guests will be charged the full amount of the
                        reservation.
                      </li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div className="h-[2px] rounded-full bg-gray-200"></div>

              <div className="pt-5">
                <p className="pb-3 font-bold">Support</p>

                {/* <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Maiores, mollitia eaque libero ab facere quaerat quasi veniam
                  ullam non voluptate doloribus minus possimus repellat deserunt
                  pariatur laboriosam. Veniam, sunt laudantium.
                </p> */}

                <Link
                  href={"/faq"}
                  className="flex justify-between pb-3 pt-5 font-semibold hover:underline"
                >
                  Get Help <ChevronRight />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-[100px] z-10 hidden h-[700px] overflow-clip rounded-lg lg:block">
          {coordinateData && (
            <SingleLocationMap
              lat={coordinateData.coordinates.location!.lat}
              lng={coordinateData.coordinates.location!.lng}
            />
          )}
        </div>
      </div>
    </div>
  );
}
