import { type Bid } from "@/server/db/schema";
import { api, type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import {
  getNumNights,
  formatCurrency,
  formatDateRange,
  plural,
} from "@/utils/utils";
import { EllipsisIcon, TrashIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MapPin from "../_icons/MapPin";
import PropertyCounterOptions from "../property-offer-response/PropertyOfferOptions";
import { Badge, type BadgeProps } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import RequestGroupAvatars from "./RequestGroupAvatars";
import WithdrawPropertyOfferDialog from "./WithdrawPropertyOfferDialog";

function getBadgeColor(status: Bid["status"]): BadgeProps["variant"] {
  switch (status) {
    case "Pending":
      return "yellow";
    case "Accepted":
      return "green";
    case "Rejected":
      return "red";
  }
}

export default function PropertyOfferCard({
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
  const previousCounter = offer.counters[1];

  const userCanCounter =
    offer.counters.length > 0 &&
    counter?.status === "Pending" &&
    counter.userId !== session?.user.id &&
    offer.status !== "Rejected" &&
    offer.status !== "Accepted";

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
  const previousCounterNightlyPrice =
    offer.counters.length > 1 && previousCounter
      ? previousCounter.counterAmount /
        getNumNights(offer.checkIn, offer.checkOut)
      : 0;

  const { data: addressData } = api.offers.getCity.useQuery({
    latitude: offer.property.latitude!,
    longitude: offer.property.longitude!,
  });

  const location = addressData
    ? `${addressData.city || ""}, ${addressData.state || ""}`
    : null;

  const originalNightlyBiddingOffer =
    offer.amount / getNumNights(offer.checkIn, offer.checkOut);

  return (
    <Card className="overflow-clip p-0">
      <CardContent className="flex">
        <Link
          href={`/property/${offer.propertyId}`}
          className="relative hidden w-60 shrink-0 bg-accent p-2 sm:block"
        >
          <Image
            src={offer.property.imageUrls[0]!}
            layout="fill"
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

        <div className="flex w-full flex-col gap-2 p-3">
          <div className="flex justify-between">
            <div>{badge}</div>
            <div className="ml-auto flex -translate-y-2 translate-x-2 items-center gap-2">
              <RequestGroupAvatars
                request={offer}
                isAdminDashboard={!isGuestDashboard}
              />
              {isGuestDashboard && offer.status === "Pending" && (
                <PropertyOfferCardDropdown offerId={offer.id} />
              )}
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

            <div className="flex flex-row items-center">
              <MapPin />
              <h2 className="text-md font-semibold">{location}</h2>
            </div>

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

          {/* {!isGuestDashboard && (
            <div className="flex justify-end gap-2">
              <PropertyOfferResponseDD offerId={offer.id} />
            </div>
          )} */}

          {/* Display for host initially */}
          {!isGuestDashboard && offer.counters.length === 0 && (
            <PropertyCounterOptions
              offerId={offer.id}
              originalNightlyBiddingOffer={originalNightlyBiddingOffer}
              counterNightlyPrice={counterNightlyPrice}
              previousOfferNightlyPrice={previousCounterNightlyPrice}
              totalCounterAmount={counter?.counterAmount ?? offer.amount} // If no counter/ original price
            />
          )}

          {userCanCounter && (
            <PropertyCounterOptions
              offerId={offer.id}
              originalNightlyBiddingOffer={originalNightlyBiddingOffer}
              counterNightlyPrice={counterNightlyPrice}
              previousOfferNightlyPrice={previousCounterNightlyPrice}
              totalCounterAmount={counter.counterAmount}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyOfferCardDropdown({ offerId }: { offerId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <WithdrawPropertyOfferDialog
        offerId={offerId}
        open={open}
        onOpenChange={setOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem red onClick={() => setOpen(true)}>
            <TrashIcon />
            Withdraw
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
