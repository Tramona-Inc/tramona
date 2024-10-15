import { HelpCircleIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDateRange, getDaysUntilTrip } from "@/utils/utils";
import Image from "next/image";
import UserAvatar from "../_common/UserAvatar";
import { type TripCardDetails } from "@/pages/my-trips";
import { api } from "@/utils/api";
import ChatOfferButton from "../offers/ChatOfferButton";
import TripCancelDialog from "./TripCancelDialog";

export default function UpcomingTripCard({ trip }: { trip: TripCardDetails }) {
  const { data } = api.properties.getById.useQuery({ id: trip.propertyId });
  const hostId = data?.hostId;
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
                  name={trip.property.host?.name}
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
              <Link
                href={`/my-trips/${trip.id}`}
                className="text-xl font-bold lg:text-2xl"
              >
                {trip.property.name}
              </Link>

              <p className="flex flex-row items-center gap-x-1">
                <MapPinIcon size={18} />
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
            <ChatOfferButton
              offerId={trip.offerId!.toString()}
              offerHostId={hostId ?? null}
              offerPropertyName={trip.property.name}
            />
            <Button asChild variant="secondary">
              <Link href="/faq">
                <HelpCircleIcon />
                Help
              </Link>
            </Button>
            {trip.tripsStatus !== "Cancelled" && (
              <TripCancelDialog
                tripId={trip.id}
                tripCancellation={trip.property.cancellationPolicy!}
                bookingDate={trip.createdAt}
                checkInDate={trip.checkIn}
                checkOutDate={trip.checkOut}
                checkInTime={trip.property.checkInTime}
                checkOutTime={trip.property.checkOutTime}
                totalPriceAfterFees={trip.totalPriceAfterFees}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
