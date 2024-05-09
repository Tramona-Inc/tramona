import { type Bid } from "@/server/db/schema";
import { type RouterOutputs } from "@/utils/api";
import { formatCurrency, formatDateRange, plural } from "@/utils/utils";
import { CalendarIcon, EllipsisIcon, TrashIcon, UsersIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PropertyOfferResponseDD } from "../property-offer-response/PropertyOfferResponseDD";
import { Badge, type BadgeProps } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
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
interface OfferProps {
  isGuestDashboard: boolean;
  offer: RouterOutputs["biddings"]["getMyBids"][number] | RouterOutputs["biddings"]["getAllPending"][number];
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
  const badge = (
    <Badge variant={getBadgeColor(offer.status)}>{offer.status}</Badge>
  );

  return (
    <Card className="overflow-clip p-0">
      <CardContent className="flex">
        <Link
          href={`/property/${offer.propertyId}`}
          className="relative hidden w-40 shrink-0 bg-accent p-2 sm:block"
        >
          <Image
            src={offer.property.imageUrls[0]!}
            layout="fill"
            className="object-cover"
            alt=""
          />
          <div className="absolute hidden sm:block">{badge}</div>
        </Link>
        <div className="flex w-full flex-col p-4">
          <div className="sm:hidden">{badge}</div>
          <div className="flex justify-between">
            <p className="text-lg font-semibold">{offer.property.name}</p>
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
          <div className="text-muted-foreground">
            <p>
              offer for{" "}
              <b className="text-lg text-foreground">
                {formatCurrency(offer.amount)}
              </b>
              /night
            </p>
            <div className="flex items-center gap-1">
              <CalendarIcon className="size-4" />
              {formatDateRange(offer.checkIn, offer.checkOut)}
              <UsersIcon className="ml-3 size-4" />
              {plural(offer.numGuests, "guest")}
            </div>
          </div>
          {!isGuestDashboard && (
            <div className="flex justify-end gap-2">
              <PropertyOfferResponseDD offerId={offer.id} />
            </div>
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
