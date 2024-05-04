import Head from "next/head";
import Link from "next/link";

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, plural } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/_common/UserAvatar";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Images,
  MessageCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  {
    ssr: false, // Disable server-side rendering for this component
  },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  {
    ssr: false,
  },
);
const Circle = dynamic(
  () => import("react-leaflet").then((module) => module.Circle),
  {
    ssr: false,
  },
);

export default function TripDetailsPage() {
  const [center, setCenter] = useState<LatLngTuple>([0, 0]);
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    setCenter([50.5, 30.5]);
    setZoom(14);
  }, []);

  return (
    <DashboardLayout type="guest">
      <Head>
        <title>My Trips | Tramona</title>
      </Head>

      <div className="container col-span-10 flex min-h-screen-minus-header flex-col gap-5 py-10 2xl:col-span-11">
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
                src={"https://placehold.co/700x400.png"}
                width={700}
                height={400}
                className="w-full"
              />
              <Badge
                variant="lightGray"
                className="absolute right-4 top-4 font-bold"
              >
                <Images className="mx-1 w-4" /> Show all photos
              </Badge>
              <div className="absolute bottom-8 left-5 text-white">
                <p className="text-base font-semibold lg:text-lg">
                  The countdown to your trip begins
                </p>
                <p className="text-3xl font-bold">7 days to go</p>
              </div>
            </div>

            <div className="space-y-3 p-4">
              <div>
                <h1 className="text-3xl font-bold">Property Name/Title</h1>
                <div className="flex justify-between pt-2">
                  <div className="flex gap-2">
                    <UserAvatar name={"Pam"} />
                    <div>
                      <p className="text-sm text-muted-foreground">Hosted by</p>
                      <p>Pam</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-[160px] text-xs lg:w-[200px] lg:text-sm"
                  >
                    <MessageCircle className="w-4 lg:w-5" /> Message your host
                  </Button>
                </div>
              </div>

              <div className="h-[2px] rounded-full bg-gray-200"></div>

              <div>
                <div className="flex items-end justify-between">
                  <h2 className="text-2xl font-bold">Your trip</h2>
                  <Badge
                    variant="lightGray"
                    className="border text-emerald-600"
                  >
                    <Clock className="w-4" />
                    Booking confirmed
                  </Badge>
                </div>
                <p>
                  <span>{plural(5, "night")}</span>
                  <span className="mx-2">·</span>
                  <span>{plural(2, "Adult")}</span>
                </p>

                <div className="flex items-center justify-between py-5">
                  <div className="flex flex-col">
                    <p className="font-bold">Check-in</p>
                    <p className="text-lg font-bold">Thu, Apr 25</p>
                    <p className="font-semibold">4:00 pm</p>
                  </div>
                  <ArrowRight />
                  <div className="flex flex-col">
                    <p className="font-bold">Check-in</p>
                    <p className="text-lg font-bold">Thu, Apr 25</p>
                    <p className="font-semibold">4:00 pm</p>
                  </div>
                </div>

                <div className="h-[2px] rounded-full bg-gray-200"></div>

                <div className="flex flex-col lg:hidden">
                  <p className="pb-2 pt-5 text-xl font-bold">Getting there</p>
                  <p>1234 Sunshine Blvd</p>
                  <p>Los Angeles, CA, USA</p>

                  <div className="relative z-10 my-3 overflow-clip rounded-lg">
                    <MapContainer
                      center={center}
                      zoom={zoom}
                      scrollWheelZoom={false}
                      className="h-[300px]"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Circle
                        center={center}
                        radius={200} // Adjust radius as needed
                        pathOptions={{ color: "black" }} // Customize circle color and other options
                      />
                    </MapContainer>
                  </div>
                </div>
                <Link
                  href={`/`}
                  className="flex justify-between pb-5 pt-3 font-semibold hover:underline lg:pt-5"
                >
                  Show property details <ChevronRight />
                </Link>

                <div className="h-[2px] rounded-full bg-gray-200"></div>

                <div>
                  <p className="pb-2 pt-5 text-xl font-bold">Payment info</p>
                  <div className="flex justify-between">
                    <p className="font-bold">Total cost</p>
                    <p className="text-sm text-muted-foreground">Paid Apr 1</p>
                  </div>
                  <p>$535.72</p>

                  <Link
                    href={`/`}
                    className="flex justify-between py-5 font-semibold hover:underline"
                  >
                    View payment details <ChevronRight />
                  </Link>
                </div>

                <div className="h-[2px] rounded-full bg-gray-200"></div>

                <div className="py-5">
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
                          If cancellation is made <strong>14 days</strong> or
                          more prior to the scheduled arrival date, guests will
                          receive a full refund of the booking deposit.
                        </li>
                        <li>
                          If cancellation is made within <strong>7 days</strong>{" "}
                          of the scheduled arrival date, guests will forfeit the
                          booking deposit.
                        </li>
                        <li>
                          In the event of a no-show or cancellation on the day
                          of check-in, guests will be charged the full amount of
                          the reservation.
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="h-[2px] rounded-full bg-gray-200"></div>

                <div className="pt-5">
                  <p className="pb-3 font-bold">Support</p>

                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Maiores, mollitia eaque libero ab facere quaerat quasi
                    veniam ullam non voluptate doloribus minus possimus repellat
                    deserunt pariatur laboriosam. Veniam, sunt laudantium.
                  </p>

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
            <MapContainer
              center={center}
              zoom={zoom}
              scrollWheelZoom={false}
              className="h-[700px]"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Circle
                center={center}
                radius={200} // Adjust radius as needed
                pathOptions={{ color: "black" }} // Customize circle color and other options
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
