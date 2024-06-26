import CounterForm from '@/components/property-offer-response/CounterForm';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

export function CounterBidDialog({
  offerId,
  open,
  setOpen,
  counterNightlyPrice,
  previousOfferNightlyPrice,
  originalNightlyBiddingOffer,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Review Counter Offer
          </DialogTitle>
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
