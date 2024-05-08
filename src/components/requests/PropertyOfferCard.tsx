import { type RouterOutputs } from "@/utils/api";
import {
  daysBetweenDates,
  formatCurrency,
  formatDateRange,
  plural,
} from "@/utils/utils";
import { EllipsisIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MapPin from "../_icons/MapPin";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import WithdrawPropertyOfferDialog from "./WithdrawPropertyOfferDialog";

export default function PropertyOfferCard({
  offer,
}: {
  offer: RouterOutputs["biddings"]["getMyBids"][number];
}) {
  const isAccepted = !!offer.resolvedAt;

  const [open, setOpen] = useState(false);

  return (
    <div className="border-2xl flex flex-row rounded-lg border shadow-md md:flex-row">
      <WithdrawPropertyOfferDialog
        offerId={offer.id}
        open={open}
        onOpenChange={setOpen}
      />
      <Link
        href={`/property/${offer.propertyId}`}
        className="relative flex items-center justify-center max-md:ml-5 md:h-[200px] md:w-1/3"
      >
        <Badge
          variant={offer.resolvedAt ? "green" : "lightGray"}
          className="xs:top-5 absolute left-2 top-7 z-40 md:left-2 md:top-2"
        >
          {isAccepted ? "Accepted" : "Pending"}
        </Badge>
        <Image
          alt=""
          className="max-md absolute hidden rounded-lg md:block md:rounded-r-none"
          src={offer.property.imageUrls[0]!}
          fill
          objectFit="cover"
        />
        <Image
          alt=""
          className="aspect-square rounded-md object-cover"
          src={offer.property.imageUrls[0]!}
          height={200}
          width={200}
        />
      </Link>
      <div className="flex w-full flex-col space-y-3 p-5">
        <div className="flex flex-row justify-between">
          <p className="flex flex-row items-center font-bold md:text-xl">
            <MapPin />
            {offer.property.name}
          </p>
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
        </div>
        <p>
          Offered{" "}
          {formatCurrency(
            offer.amount / daysBetweenDates(offer.checkIn, offer.checkOut),
          )}
          /night
        </p>
        <p>{formatDateRange(offer.checkIn, offer.checkOut)}</p>

        <div className="flex flex-row justify-between">
          <p>{plural(offer.numGuests, "guest")}</p>
          <div className="hidden flex-row font-semibold md:block">
            {/* <Button variant={"secondary"} className="font-semibold">
              Resend Confirmation
            </Button>
            <Button variant={"underline"} className="font-semibold">
              Update request
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
