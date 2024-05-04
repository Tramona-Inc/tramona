import Link from "next/link";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { MessageCircle } from "lucide-react";

import UserAvatar from "../_common/UserAvatar";
import MapPin from "../_icons/MapPin";
import { type UpcomingTrip } from "./UpcomingTrips";

export default function UpcomingTripCard({ trip }: { trip: UpcomingTrip }) {
  return (
    <div className="w-full">
      <div className="flex flex-col overflow-clip rounded-lg border lg:flex-row">
        <div className="relative">
          <Badge
            variant="lightGray"
            className="absolute left-4 top-4 font-bold"
          >
            Trip in 7 days
          </Badge>
          <img
            src={"https://placehold.co/600x400.png"}
            width={600}
            height={400}
          />
        </div>

        <div className="flex w-full flex-col gap-5 p-4 lg:gap-8 lg:p-10">
          <div className="flex w-full flex-col justify-between gap-3 lg:flex-row lg:gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Property Name/Title</h2>
              <div className="flex gap-2">
                <UserAvatar name={"Pam"} />
                <div className="flex w-full justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p>Pam</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-[170px] text-sm md:w-[200px] lg:hidden"
                  >
                    <MessageCircle className="w-4 md:w-5" /> Message your host
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Location</h3>
              <div className="flex">
                <MapPin />
                <p>1234 Sunshine Blvd Los Angeles, CA, USA</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Check-in details</h3>
              <p>Thu Apr 25 - Tue Apr 30</p>
              <Link
                href={`/my-trips/${1}`}
                className="text-sm font-bold underline underline-offset-4"
              >
                View more
              </Link>
            </div>
          </div>

          <div className="h-[2px] rounded-full bg-gray-200"></div>

          <div className="flex justify-between gap-4">
            <Button
              variant="secondary"
              className="hidden w-[175px] text-xs lg:flex lg:w-[160px] xl:w-[200px] xl:text-sm"
            >
              <MessageCircle className="w-4 xl:w-5" /> Message your host
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[170px] text-xs lg:w-[160px] xl:w-[200px] xl:text-sm"
                >
                  Cancelation Policy
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="p-0">
                <SheetHeader className="border-b-[1px] p-5">
                  <SheetTitle className="text-xl font-bold lg:text-2xl">
                    Cancelation Policy
                  </SheetTitle>
                </SheetHeader>

                <div className="border-b-[1px] px-5 py-10">
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

                    <li>
                      Reservation Modifications:
                      <ul className="list-inside list-disc">
                        <li>
                          Guests may request modifications to their reservation
                          dates, subject to availability. Any changes must be
                          requested in writing and approved by us.
                        </li>
                      </ul>
                    </li>

                    <li>
                      Refunds:
                      <ul className="list-inside list-disc">
                        <li>
                          Refunds, if applicable, will be processed within{" "}
                          <strong>30 business days</strong> from the date of
                          cancellation confirmation.
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <SheetFooter className="p-5">
                  <SheetClose asChild>
                    <Button className="w-full lg:w-[200px]">Done</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              className="w-[170px] text-xs lg:w-[160px] xl:w-[200px] xl:text-sm"
            >
              Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
