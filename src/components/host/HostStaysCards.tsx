import Image from "next/image";
import { Button } from "../ui/button";
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
import { EllipsisIcon, FlagIcon } from "lucide-react";
import Link from "next/link";
import { useChatWithHost } from "@/utils/messaging/useChatWithHost";
import Spinner from "../_common/Spinner";

export default function HostStaysCards({
  trips,
}: {
  trips?: RouterOutputs["trips"]["getHostTrips"];
}) {
  const chatWithHost = useChatWithHost();

  if (!trips) return <Spinner />;
  if (trips.length === 0)
    return (
      <p className="mt-32 text-center text-muted-foreground">
        No trips to show
      </p>
    );

  return (
    <div className="mb-36 space-y-6">
      {trips.map((trip) => {
        const numNights = getNumNights(trip.checkIn, trip.checkOut);
        const totalPrice = trip.offer!.totalPrice;

        const hostId = trip.property.host?.id ?? "";

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
                    <DropdownMenuItem asChild red>
                      <Link href="/host/resolution-form">
                        <FlagIcon height={16} />
                        Report Damage
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
