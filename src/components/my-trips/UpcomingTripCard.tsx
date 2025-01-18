import { HelpCircleIcon, MessageCircleMore } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDateRange, getDaysUntilTrip } from "@/utils/utils";
import Image from "next/image";
import UserAvatar from "../_common/UserAvatar";
import { type TripCardDetails } from "@/pages/my-trips";
import ChatOfferButton from "../propertyPages/sections/ChatOfferButton";
import TripCancelDialog from "./TripCancelDialog";
import { useChatWithHost } from "@/utils/messaging/useChatWithHost";

export default function UpcomingTripCard({ trip }: { trip: TripCardDetails }) {
  const chatWithHost = useChatWithHost();
  const hostId = trip.property.hostTeam.ownerId;

  return (
    <div className="w-full">
      <div className="flex flex-col overflow-clip rounded-xl border shadow-md lg:flex-row">
        <div className="flex w-full flex-col gap-4 p-4 pt-12 lg:pt-4">
          <div className="flex w-full flex-col justify-start gap-3 lg:flex-row lg:gap-x-6">
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
                    Trip in {getDaysUntilTrip(trip.checkIn)} days
                  </Badge>
                </Link>
              </div>
              <div className="mt-4 flex gap-2">
                <UserAvatar
                  name={trip.property.hostTeam.owner.name}
                  image={
                    trip.property.hostTeam.owner.image ??
                    "/assets/images/tramona-logo.jpeg"
                  }
                />
                <div className="flex w-full justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hosted by</p>
                    <p>
                      {trip.property.hostTeam.owner.name ??
                        trip.property.hostTeam.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <Link
                href={`/my-trips/${trip.id}`}
                className="text-xl font-bold lg:text-2xl"
              >
                {trip.property.name}
              </Link>

              <p className="flex flex-row items-center gap-x-1">
                {trip.property.address}
              </p>

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
            <Badge
              variant={
                trip.tripsStatus === "Booked"
                  ? "green"
                  : trip.tripsStatus === "Needs attention"
                    ? "yellow"
                    : "red"
              }
              className="ml-auto"
            >
              {trip.tripsStatus}
            </Badge>
          </div>

          <div className="h-[2px] rounded-full bg-gray-200"></div>

          <div className="flex flex-col justify-center gap-2 px-4 sm:flex-row lg:gap-4">
            {/* {trip.offerId && (
              <ChatOfferButton
                offerId={trip.offerId.toString()}
                offerHostId={trip.property.hostTeam.ownerId}
                offerPropertyName={trip.property.name}
              />
            )} */}
            <Button asChild variant="primary">
              <Link href="/help-center">
                <HelpCircleIcon />
                Help
              </Link>
            </Button>
            {trip.tripsStatus !== "Cancelled" && (
              <TripCancelDialog trip={trip} />
            )}
            <Button onClick={() => chatWithHost({ hostId, hostTeamId: trip.property.hostTeam.id })}>
              <MessageCircleMore />
              Message Host
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
