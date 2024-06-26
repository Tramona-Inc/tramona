import { getBadgeColor } from "@/components/host/HostPropertyOfferCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type RouterOutputs } from "@/utils/api";
import {
  formatCurrency,
  formatDateRange,
  getNumNights,
  plural,
} from "@/utils/utils";
import { CheckIcon, ChevronDownIcon, RefreshCw, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import AcceptBidDialog from "./AcceptBidDialog";
import { CounterBidDialog } from "./CounterBidDialog";

export default function HostBidCard({
  bid,
}: {
  bid: RouterOutputs["biddings"]["getByPropertyId"][number];
}) {
  // const counters  = api.biddings.

  const fmtdPrice = formatCurrency(bid.amount);
  const numNights = getNumNights(bid.checkIn, bid.checkOut);
  const fmtdPricePerNight = formatCurrency(bid.amount / numNights);
  const fmtdDateRange = formatDateRange(bid.checkIn, bid.checkOut);

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [counterDialogOpen, setCounterDialogOpen] = useState(false);

  const { data: session } = useSession();

  const counters = bid.counters[0];

  const userCanCounter =
    bid.counters.length > 0 &&
    counters &&
    counters.status === "Pending" &&
    counters.userId !== session?.user.id &&
    bid.status !== "Rejected" &&
    bid.status !== "Accepted";

  const badge = (
    <Badge variant={getBadgeColor(bid.status)}>
      {userCanCounter ? "Counter Offer" : bid.status}
    </Badge>
  );

  const counterNightlyPrice = (bid.counters[0]?.counterAmount ?? 0) / numNights;
  const previousOfferNightlyPrice =
    (bid.counters[1]?.counterAmount ?? 0) / numNights;
  const originalNightlyBiddingOffer = bid.amount / numNights;

  return (
    <>
      <AcceptBidDialog
        bid={bid}
        open={acceptDialogOpen}
        setOpen={setAcceptDialogOpen}
      />
      <CounterBidDialog
        offerId={bid.id}
        open={counterDialogOpen}
        setOpen={setCounterDialogOpen}
        counterNightlyPrice={counterNightlyPrice}
        previousOfferNightlyPrice={previousOfferNightlyPrice}
        originalNightlyBiddingOffer={originalNightlyBiddingOffer}
      />
      <Card>
        <CardHeader>
          <div>{badge}</div>
          <div>
            {previousOfferNightlyPrice !== 0 && (
              <p className="text-xs">
                <span className="font-bold">Your Previous offer: </span>
                {formatCurrency(previousOfferNightlyPrice)}/night
              </p>
            )}
            {counterNightlyPrice !== 0 && (
              <div>
                <p className="rounded-sm text-xs">
                  <span className="font-bold">Traveller Counter offer: </span>
                  {formatCurrency(counterNightlyPrice)}/night
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        <div className="flex items-end gap-4">
          <div>
            <div className="font-semibold">{fmtdPricePerNight}/night</div>
            <div className="text-muted-foreground">{fmtdPrice} total</div>
          </div>
          <div>
            <div className="font-semibold">{fmtdDateRange}</div>
            <div className="text-muted-foreground">
              {plural(numNights, "night")}
            </div>
          </div>
          <div>
            <div className="font-semibold">
              {plural(bid.numGuests, "guest")}
            </div>
            <div className="text-muted-foreground">&nbsp;</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="ml-auto">
                Respond
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={() => setAcceptDialogOpen(true)}>
                <CheckIcon />
                Accept
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCounterDialogOpen(true)}>
                <RefreshCw />
                Counter
              </DropdownMenuItem>
              <DropdownMenuItem red>
                <XIcon />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </>
  );
}
