import { type GuestDashboardRequest } from "./RequestCard";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Image from "next/image";
import UserAvatar from "../_common/UserAvatar";
import Link from "next/link";
import {
  formatCurrency,
  getNumNights,
  getOfferDiscountPercentage,
} from "@/utils/utils";
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
          const offerNightlyPrice =
            offer.travelerOfferedPriceBeforeFees / numNights;
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
                <div className="absolute left-2 top-2 flex gap-1">
                  <Badge variant="whiteGreen">
                    {discountPercentage}% off{" "}
                    {offer.property.bookOnAirbnb ? "" : "Airbnb price"}
                  </Badge>
                  {/* {offer.property.bookOnAirbnb && (
                    <Badge variant="white">Airbnb</Badge>
                  )} */}
                </div>
              </div>
              <div className="gap-y-1 px-2 pb-3 pt-1">
                <div className="flex flex-row">
                  <p className="truncate font-bold text-foreground">
                    {property.name}
                  </p>
                  {/* add stars rating in future */}
                </div>
                <p className="line-clamp-1 text-xs font-medium text-muted-foreground">
                  {property.numBedrooms} bed · {property.numBathrooms} bath
                </p>
                <div className="my-2 flex flex-row items-center">
                  {offer.datePriceFromAirbnb && (
                    <p className="mr-1 line-clamp-1 text-xs text-muted-foreground line-through">
                      {formatCurrency(offer.datePriceFromAirbnb).split(".")[0]}
                    </p>
                  )}
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    <span className="text-sm font-bold text-foreground">
                      {formatCurrency(offerNightlyPrice).split(".")[0]}
                    </span>{" "}
                    / night
                  </p>
                </div>
                <div className="flex flex-row items-center gap-x-2">
                  <div className="shrink-0">
                    <UserAvatar
                      name={host?.name ?? property.hostName ?? "Tramona"}
                      image={
                        host?.image ??
                        property.hostProfilePic ??
                        "/assets/images/tramona.svg"
                      }
                      size="xs"
                    />
                  </div>
                  <p className="text-sm text-foreground">
                    Listing by {host?.name ?? property.hostName ?? "Tramona"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}