import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Image from "next/image";
import UserAvatar from "../_common/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import {
  formatCurrency,
  formatDateMonthDayYear,
  getNumNights,
} from "@/utils/utils";
import { ExternalLinkIcon } from "lucide-react";

import { GuestDashboardRequestToBook } from "./TravelerRequestToBookCard";

export function RequestToBookCardPreviews({
  requestToBook,
}: {
  requestToBook: GuestDashboardRequestToBook;
}) {
  const numNights = getNumNights(requestToBook.checkIn, requestToBook.checkOut);
  const requestedNightlyPrice =
    requestToBook.amountAfterTravelerMarkupAndBeforeFees / numNights;

  const checkIn = formatDateMonthDayYear(requestToBook.checkIn);
  const checkOut = formatDateMonthDayYear(requestToBook.checkOut);

  return (
    <ScrollArea>
      <div className="flex gap-2">
        <Link
          key={requestToBook.id}
          href={`/request-to-book/${requestToBook.propertyId}checkIn=${checkIn}&checkOut=${checkOut}&numGuests=${requestToBook.numGuests}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group w-60 overflow-hidden rounded-lg border hover:bg-zinc-100"
        >
          <div className="relative h-32 bg-accent">
            <Image
              src={requestToBook.property.imageUrls[0]!}
              alt=""
              fill
              className="object-cover"
            />
            <div className="to-black/65 absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-[90%] p-2">
              <p className="line-clamp-1 text-sm font-semibold text-white">
                {requestToBook.property.name}
              </p>
              <p className="line-clamp-1 text-xs font-medium text-white">
                {requestToBook.property.numBedrooms} bed ·{" "}
                {requestToBook.property.numBathrooms} bath
              </p>
            </div>
            <div className="absolute left-1 top-1 flex gap-1"></div>
            <div className="absolute right-1 top-1 flex -translate-y-2 items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
              View property <ExternalLinkIcon className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="text-xs font-semibold">
            <div className="flex items-center gap-2 overflow-hidden p-1">
              <div className="shrink-0">
                <UserAvatar
                  name={requestToBook.property.name}
                  image={
                    requestToBook.property.hostProfilePic ??
                    "/assets/images/tramona.svg"
                  }
                />
              </div>
              <div>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  You requested ·{" "}
                  {formatDistanceToNowStrict(requestToBook.createdAt, {
                    addSuffix: true,
                  })}
                </p>
                <div className="flex items-end justify-between gap-1">
                  <p className="line-clamp-1 font-bold">
                    <span className="text-lg/none text-foreground">
                      {formatCurrency(requestedNightlyPrice).split(".")[0]}
                    </span>
                    /night
                  </p>
                </div>
              </div>
            </div>
            {requestToBook.property.bookOnAirbnb ? (
              <div>Booking through Airbnb</div>
            ) : (
              <div>Booking through Tramona</div>
            )}
          </div>
        </Link>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
