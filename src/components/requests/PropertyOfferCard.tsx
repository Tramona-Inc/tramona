import { type Bid } from "@/server/db/schema";
import { type RouterOutputs } from "@/utils/api";
import { AVG_AIRBNB_MARKUP } from "@/utils/constants";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { EllipsisIcon, Pencil, TrashIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMediaQuery } from "../_utils/useMediaQuery";
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
import EditPropertyOfferDialog from "./EditPropertyOfferDialog";
import MobileSimilarProperties from "./MobileSimilarProperties";
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

  const totalNights = getNumNights(offer.checkIn, offer.checkOut);

  const originalNightlyBiddingOffer = offer.amount / totalNights;

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
              {isGuestDashboard && offer.status === "Pending" && (
                <PropertyOfferCardDropdown
                  offerId={offer.id}
                  propertyId={offer.propertyId}
                  guests={offer.numGuests}
                  originalNightlyBiddingOffer={originalNightlyBiddingOffer}
                  totalNights={totalNights}
                  checkIn={offer.checkIn}
                  checkOut={offer.checkOut}
                />
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
      <div className="lg:hidden">
        <Separator />
        <div className=" mt-1 max-h-[300px] max-w-[360px] px-5">
          <MobileSimilarProperties
            city={offer.property.address!}
            location={offer.property.address!}
          />
        </div>
      </div>
    </Card>
  );
}

function PropertyOfferCardDropdown({
  offerId,
  propertyId,
  guests,
  originalNightlyBiddingOffer,
  checkIn,
  checkOut,
}: {
  offerId: number;
  propertyId: number;
  totalNights: number;
  guests: number;
  checkIn: Date;
  checkOut: Date;
  originalNightlyBiddingOffer: number;
}) {
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <WithdrawPropertyOfferDialog
        offerId={offerId}
        open={openWithdraw}
        onOpenChange={setOpenWithdraw}
      />
      <EditPropertyOfferDialog
        offerId={offerId}
        propertyId={propertyId}
        originalNightlyBiddingOffer={originalNightlyBiddingOffer}
        guests={guests}
        checkIn={checkIn}
        checkOut={checkOut}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem red onClick={() => setOpenWithdraw(true)}>
            <TrashIcon />
            Withdraw
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
