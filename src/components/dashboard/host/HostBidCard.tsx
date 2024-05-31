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
        counterNightlyPrice={bid.counters[0]?.counterAmount ?? 0}
        previousOfferNightlyPrice={bid.counters[0]?.counterAmount ?? 0}
        originalNightlyBiddingOffer={bid.amount / numNights}
      />
      <Card>
        <CardHeader>Counter Offer</CardHeader>
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
