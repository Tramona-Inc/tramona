import { type Bid } from "@/server/db/schema";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Badge, type BadgeProps } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

import { Separator } from "../ui/separator";
import RequestGroupAvatars from "./RequestGroupAvatars";
import PropertyDeleteDialog from "../property-offer-response/PropertyDeleteDialog";

function getBadgeColor(status: Bid["status"]): BadgeProps["variant"] {
  switch (status) {
    case "Pending":
      return "yellow";
    case "Accepted":
      return "green";
    case "Rejected":
      return "red";
    case "Cancelled":
      return "red";
  }
}

export default function PropertyOfferAcceptedCard({
  offer,
  isGuestDashboard,
}:
  | {
      isGuestDashboard: true;
      offer: RouterOutputs["biddings"]["getMyBids"][number];
    }
  | {
      isGuestDashboard?: false;
      offer: RouterOutputs["biddings"]["getAllPending"][number];
    }) {
  const { data: session } = useSession();

  const counter = offer.counters[0];

  const userCanCounter =
    offer.counters.length > 0 &&
    counter?.status === "Pending" &&
    counter.userId !== session?.user.id &&
    offer.status !== "Rejected" &&
    offer.status !== "Accepted" &&
    offer.status !== "Cancelled";

  const badge = (
    <Badge variant={getBadgeColor(offer.status)}>
      {userCanCounter ? "Counter Offer" : offer.status}
    </Badge>
  );

  // ! clean up
  const counterNightlyPrice = counter
    ? counter.counterAmount / getNumNights(offer.checkIn, offer.checkOut)
    : 0;

  // ! previous counter for host/admin will always be 0 cause it can only gets one counter
  // ! update query so host can see all counters

  const totalNights = getNumNights(offer.checkIn, offer.checkOut);

  const originalNightlyBiddingOffer = offer.amount / totalNights;
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="cursor-pointer p-0 lg:overflow-clip">
      <CardContent className="flex">
        <Link
          href={`/property/${offer.propertyId}`}
          className="relative hidden w-60 shrink-0 bg-accent p-2 sm:block"
        >
          <Image
            src={offer.property.imageUrls[0]!}
            fill
            className="object-cover"
            alt=""
          />
          {/* <div className="absolute hidden sm:block">{badge}</div> */}
          {userCanCounter && (
            <div className="absolute hidden sm:block">
              {<Badge variant={"green"}>Expires 24 hours</Badge>}
            </div>
          )}
        </Link>

        <div className="flex w-full flex-col gap-2 p-3 ">
          <div className="flex justify-between">
            <div>{badge}</div>
            <div className="ml-auto flex -translate-y-2 translate-x-2 items-center gap-2">
              <RequestGroupAvatars
                request={offer}
                isAdminDashboard={!isGuestDashboard}
              />
            </div>
          </div>

          <div className="-mt-4">
            <p className="text-lg font-bold text-black ">
              {offer.property.name}
            </p>

            <p className="text-xs text-muted-foreground">
              Airbnb Price:{" "}
              {formatCurrency(
                offer.property.originalNightlyPrice
                  ? offer.property.originalNightlyPrice * AVG_AIRBNB_MARKUP
                  : 0,
              )}
              /night
            </p>

            <div className="text-md flex items-center gap-1 font-semibold">
              {formatDateRange(offer.checkIn, offer.checkOut)} &middot;{" "}
              {plural(offer.numGuests, "guest")}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm">
              <span className="font-bold">Original Bidding Offer: </span>
              {formatCurrency(originalNightlyBiddingOffer)}
              /night
            </p>
          </div>

          <PropertyDeleteDialog
            offerId={offer.id}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            originalNightlyBiddingOffer={originalNightlyBiddingOffer}
            counterNightlyPrice={counterNightlyPrice}
          />
        </div>
      </CardContent>
    </Card>
  );
}
