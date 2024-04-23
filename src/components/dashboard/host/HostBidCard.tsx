import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import AcceptBidDialog from "./AcceptBidDialog";
import { useState } from "react";

export default function HostBidCard({
  bid,
}: {
  bid: RouterOutputs["biddings"]["getByPropertyId"][number];
}) {
  const fmtdPrice = formatCurrency(bid.amount);
  const numNights = getNumNights(bid.checkIn, bid.checkOut);
  const fmtdPricePerNight = formatCurrency(bid.amount / numNights);
  const fmtdDateRange = formatDateRange(bid.checkIn, bid.checkOut);

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  return (
    <>
      <AcceptBidDialog
        bid={bid}
        open={acceptDialogOpen}
        setOpen={setAcceptDialogOpen}
      />
      <Card>
        {/* <div className="flex justify-between">
      <Badge variant="yellow">Pending</Badge>
      <BidGroupAvatars isAdminDashboard bid={bid} />
    </div> */}
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
