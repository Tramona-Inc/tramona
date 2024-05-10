import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import CounterForm from "./CounterForm";

export function PropertyCounterDialog({
  offerId,
  open,
  setOpen,
  counterNightlyPrice,
  previousOfferNightlyPrice,
  originalNightlyBiddingOffer
}: {
  offerId: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  counterNightlyPrice: number;
  previousOfferNightlyPrice: number;
  originalNightlyBiddingOffer: number;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant={"secondaryLight"}>Re-counter</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Review Counter Offer</DialogTitle>
        </DialogHeader>
        <CounterForm
          offerId={offerId}
          setOpen={setOpen}
          counterNightlyPrice={counterNightlyPrice}
          previousOfferNightlyPrice={previousOfferNightlyPrice}
          originalNightlyBiddingOffer={originalNightlyBiddingOffer}
        />
      </DialogContent>
    </Dialog>
  );
}
