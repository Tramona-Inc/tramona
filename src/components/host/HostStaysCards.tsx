import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { type RouterOutputs } from "@/utils/api";
import { formatDistanceToNowStrict } from "date-fns";
import { CheckCircle, EllipsisIcon, FlagIcon } from "lucide-react";
import Link from "next/link";
import { useChatWithHost } from "@/utils/messaging/useChatWithHost";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type StaysTabs =
  | "currently-hosting"
  | "checking-out"
  | "upcoming"
  | "accepted"
  | "history";

export default function HostStaysCards({
  trips,
  staysTab,
}: {
  trips?: RouterOutputs["trips"]["getHostTrips"];
  staysTab?: StaysTabs;
}) {
  const chatWithHost = useChatWithHost();

  if (!trips) return <HostStaysSkeleton />;
  if (trips.length === 0) return <HostStaysEmptyState staysTab={staysTab} />;

  return (
    <div className="mb-36 space-y-6">
      {trips.map((trip) => {
        const numNights = getNumNights(trip.checkIn, trip.checkOut);
        const totalPrice = trip.offer?.totalPrice;

        const hostId = trip.property.hostTeam.ownerId;

        return (
          <div key={trip.id}>
            <div
              className="grid grid-cols-1 items-center gap-4 overflow-hidden rounded-xl border md:grid-cols-7 md:rounded-2xl"
              key={trip.id}
            >
              <div className="relative h-40 md:h-28">
                <Image
                  src={trip.property.imageUrls[0]!}
                  alt={trip.property.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="px-4 md:col-span-2 md:px-0">
                <h1 className="text-balance font-bold">{trip.property.name}</h1>
                <p className="text-muted-foreground">{trip.property.city}</p>
              </div>
              <div className="px-4 md:px-0">
                <p className="font-bold">
                  {formatDateRange(trip.checkIn, trip.checkOut)}
                </p>
                {
                  <p className="text-sm text-blue-600">
                    Checks out{" "}
                    {formatDistanceToNowStrict(trip.checkOut, {
                      addSuffix: true,
                    })}
                  </p>
                }
              </div>
              {totalPrice && (
                <div className="px-4 md:px-0">
                  <p className="font-bold">
                    {formatCurrency(totalPrice / numNights)}/night
                  </p>
                  <p className="text-muted-foreground">
                    {formatCurrency(totalPrice)} total
                  </p>
                </div>
              )}
              <p className="mb-4 px-4 md:mb-0 md:px-0">
                <span className="underline">
                  {trip.offer?.request?.madeByGroup.owner.name}
                </span>{" "}
                {trip.numGuests > 1 && (
                  <span className="text-muted-foreground">
                    + {plural(trip.numGuests - 1, "guest")}
                  </span>
                )}
              </p>
              <div className="hidden flex-col items-end gap-y-4 pr-2 text-end md:flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <EllipsisIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href="/host/report/resolution-form"
                        className="flex w-full flex-row justify-around gap-x-1"
                      >
                        Report Damage <FlagIcon height={16} />
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="secondary"
                  onClick={() => chatWithHost({ hostId })}
                >
                  Message
                </Button>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full md:hidden"
              onClick={() => chatWithHost({ hostId })}
            >
              Message
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export function HostStaysEmptyState({ staysTab }: { staysTab?: StaysTabs }) {
  let text = "";

  if (staysTab) {
    switch (staysTab) {
      case "currently-hosting":
        text = "You don't currently have any guests staying.";
        break;
      case "checking-out":
        text = "No guests are checking out today or tomorrow.";
        break;
      case "upcoming":
        text = "You don't have any upcoming reservations.";
        break;
      case "accepted":
        text = "You haven't accepted any reservations yet.";
        break;
      case "history":
        text = "There are no past stays available in your history.";
        break;
      default:
        text = "You don't have any reservations booked.";
    }
  } else {
    text = "You don't have any reservations booked.";
  }
  return (
    <Card className="border-primary/20">
      <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <CheckCircle className="h-8 w-8 text-primary" />
        <p className="text-lg text-muted-foreground">{text}</p>
        <Button variant="link" asChild>
          <Link href="/host/requests">See requests</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function HostStaysSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((index) => (
        <Card key={index} className="flex p-3">
          {/* Property Image */}
          <Skeleton className="aspect-[4/3] h-20 w-36 rounded-md" />

          {/* Content Container */}
          <div className="flex flex-1 flex-col justify-between pl-3">
            <div className="flex items-start justify-between">
              {/* Left side content */}
              <div className="space-y-1">
                <Skeleton className="h-5 w-28" /> {/* Property name */}
                <Skeleton className="h-3 w-32" /> {/* Location */}
              </div>

              {/* Right side content */}
              <div className="text-right">
                <Skeleton className="h-3 w-20" /> {/* Dates */}
                <Skeleton className="mt-1 h-2 w-28" /> {/* Check out status */}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
