import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { HelpCircleIcon, InfoIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDateRange, getCancellationPolicy } from "@/utils/utils";
import Image from "next/image";
import UserAvatar from "../_common/UserAvatar";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useChatWithAdmin } from "@/utils/useChatWithAdmin";
import { type TripCardDetails } from "@/pages/my-trips";
import { api } from "@/utils/api";

// Plugin for relative time
dayjs.extend(relativeTime);

export default function UpcomingTripCard({ trip }: { trip: TripCardDetails }) {
  const chatWithAdmin = useChatWithAdmin();

  const slackMutation = api.twilio.sendSlack.useMutation();


  const formatText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <span key={index} className="block">
        <span style={{ color: "#000000", fontWeight: "bold" }}>
          {line.split(":")[0]}:
        </span>
        <span style={{ color: "#343434" }}>
          {line.includes(":") && line.split(":")[1]}
        </span>
      </span>
    ));
  };

  const handleRequestCancellation = async () => {
    await slackMutation.mutateAsync({
      message: `Tramona: A traveler with payment id: ${trip.offer.paymentIntentId} requested a cancellation on ${trip.property.name} from ${formatDateRange(trip.offer?.checkIn, trip.offer?.checkOut)}. The cancellation policy is ${trip.property.cancellationPolicy}.`,
    });
  }

  return (
    <div className="w-full">
      <div className="flex flex-col overflow-clip rounded-xl border shadow-md lg:flex-row">
        <div className="flex w-full flex-col gap-4 p-4 pt-12 lg:pt-4">
          <div className="flex w-full flex-col justify-between gap-3 lg:flex-row lg:gap-6">
            <div className="flex flex-col gap-4 lg:gap-0">
              <div className="flex justify-center sm:justify-start">
                <Link
                  href={`/my-trips/${trip.id}`}
                  className="relative -mt-8 h-48 w-full sm:h-32 sm:w-52 lg:-mt-0"
                >
                  <Image
                    fill
                    alt=""
                    className="rounded-md object-cover"
                    src={trip.property.imageUrls[0]!}
                  />
                  <Badge variant="lightGray" className="absolute left-2 top-3">
                    Trip {dayjs(trip.checkIn).fromNow()}
                  </Badge>
                </Link>
              </div>
              <div className="mt-4 flex gap-2">
                <UserAvatar
                  name={trip.property.host?.name}
                  // image={trip.property.host?.image}
                  image={
                    trip.property.host?.image ??
                    "/assets/images/tramona-logo.jpeg"
                  }
                />
                <div className="flex w-full justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p>
                      {trip.property.host?.name
                        ? trip.property.host.name
                        : "Tramona"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <h2 className="text-xl font-bold lg:text-2xl">
                {trip.property.name}
              </h2>

              <p>{trip.property.address}</p>

              <div className="">
                <p>{formatDateRange(trip.checkIn, trip.checkOut)}</p>
                <Link
                  href={`/my-trips/${trip.id}`}
                  className="text-sm font-bold underline underline-offset-4"
                >
                  View more
                </Link>
              </div>
            </div>
          </div>

          <div className="h-[2px] rounded-full bg-gray-200"></div>

          <div className="flex flex-col justify-center gap-2 px-4 sm:flex-row lg:gap-4">
            <Button variant="secondary" onClick={() => chatWithAdmin()}>
              <MessageCircle className="size-4" />
              Message your host
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">
                  <InfoIcon className="size-5" />
                  Cancellation Policy
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="p-0">
                <SheetHeader className="border-b-[1px] p-5">
                  <SheetTitle className="text-xl font-bold lg:text-2xl">
                    {trip.property.cancellationPolicy ? (
                      <p>
                        Cancellation Policy: {trip.property.cancellationPolicy}
                      </p>
                    ) : (
                      <p>Cancellation Policy</p>
                    )}
                  </SheetTitle>
                </SheetHeader>
                {trip.property.cancellationPolicy ? (
                  <p className="whitespace-pre-line text-left text-sm text-muted-foreground border-b-[1px] px-5 py-10">
                  {formatText(getCancellationPolicy(trip.property.cancellationPolicy))}
                </p>
                ): (
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
                )}

                <SheetFooter className="p-5">
                <SheetClose asChild>
                    <Button
                      onClick={handleRequestCancellation}
                      className="w-full lg:w-[200px]"
                    >
                      Request Cancellation
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="w-full lg:w-[200px]">Done</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>

            <Button asChild variant="secondary">
              <Link href="/faq">
                <HelpCircleIcon />
                Help
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
