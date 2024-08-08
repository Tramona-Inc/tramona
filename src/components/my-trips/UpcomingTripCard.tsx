import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { HelpCircleIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDateRange } from "@/utils/utils";
import Image from "next/image";
import UserAvatar from "../_common/UserAvatar";
import { useChatWithAdmin } from "@/utils/useChatWithAdmin";
import { type RouterOutputs } from "@/utils/api";

// Plugin for relative time
dayjs.extend(relativeTime);

export default function UpcomingTripCard({
  trip,
}: {
  trip: RouterOutputs["trips"]["getMyTrips"][number];
}) {
  const chatWithAdmin = useChatWithAdmin();

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
