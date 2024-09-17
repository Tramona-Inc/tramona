import { type GuestDashboardRequest } from "./RequestCard";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Image from "next/image";
import UserAvatar from "../_common/UserAvatar";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import {
  formatCurrency,
  getNumNights,
  getOfferDiscountPercentage,
} from "@/utils/utils";
import { ExternalLinkIcon } from "lucide-react";
import { sortBy } from "lodash";
import { Badge } from "../ui/badge";

export function RequestCardOfferPreviews({
  request,
}: {
  request: GuestDashboardRequest;
}) {
  const sortedOffers = sortBy(request.offers, (o) => -o.createdAt);

  return (
    <ScrollArea>
      <div className="flex gap-2">
        {sortedOffers.map((offer) => {
          const { property } = offer;
          const { host } = property;

          const numNights = getNumNights(offer.checkIn, offer.checkOut);
          const offerNightlyPrice = offer.travelerOfferedPrice / numNights;
          const discountPercentage = getOfferDiscountPercentage(offer);

          return (
            <Link
              key={offer.id}
              href={`/offers/${offer.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-60 overflow-hidden rounded-lg border hover:bg-zinc-100"
            >
              <div className="relative h-32 bg-accent">
                <Image
                  src={property.imageUrls[0]!}
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-b from-transparent to-black/65 to-[90%] p-2">
                  <p className="line-clamp-1 text-sm font-semibold text-white">
                    {property.name}
                  </p>
                  <p className="line-clamp-1 text-xs font-medium text-white">
                    {property.numBedrooms} bed · {property.numBathrooms} bath
                  </p>
                </div>
                <div className="absolute left-1 top-1 flex gap-1">
                  <Badge variant="white">{discountPercentage}% off Airbnb price</Badge>
                  {/* {offer.property.bookOnAirbnb && (
                    <Badge variant="white">Airbnb</Badge>
                  )} */}
                </div>
                <div className="absolute right-1 top-1 flex -translate-y-2 items-center gap-1 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white/80 opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                  View offer <ExternalLinkIcon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="text-xs font-semibold">
                <div className="flex items-center gap-2 overflow-hidden p-1">
                  <div className="shrink-0">
                    <UserAvatar
                      name={host?.name ?? property.hostName ?? "Tramona"}
                      image={host?.image ?? property.hostProfilePic ?? "/assets/images/tramona.svg"}
                    />
                  </div>
                  <div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {host?.name ?? property.hostName ?? "Tramona"} offered ·{" "}
                      {formatDistanceToNowStrict(offer.createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                    <div className="flex items-end justify-between gap-1">
                      <p className="line-clamp-1 font-bold">
                        <span className="text-lg/none text-foreground">
                          {formatCurrency(offerNightlyPrice)}
                        </span>
                        /night
                      </p>
                    </div>
                  </div>
                </div>
                {offer.property.bookOnAirbnb ? (
                  <div>Booking through Airbnb</div>
                ) : (
                  <div>Booking through Tramona</div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
