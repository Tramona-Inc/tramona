import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { errorToast } from "@/utils/toasts";
import { type Bid } from "@/server/db/schema";
import { formatCurrency, formatDateRange } from "@/utils/utils";
import { useState } from "react";

export default function AcceptCityBidDialog({
  open,
  setOpen,
  bid,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
  bid: Pick<Bid, "id" | "checkIn" | "checkOut" | "amount">;
}) {
  const { mutateAsync: acceptBid } = api.biddings.accept.useMutation();

  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    await acceptBid({
      bidId: bid.id,
    })
      .then(() => {
        toast({
          title: "Successfully accepted the bid!",
          description: `The traveler has been charged ${formatCurrency(bid.amount)} and the booking was created`, // todo: pluralize traveler correctly
        });
        setOpen(false);
      })
      .catch(() => errorToast());

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Accept bid</DialogTitle>
          <DialogDescription>
            Are you sure you want to accept this bid? This will charge the
            traveler {formatCurrency(bid.amount)} and create a booking for{" "}
            {formatDateRange(bid.checkIn, bid.checkOut)}.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleClick} disabled={loading}>
            Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
