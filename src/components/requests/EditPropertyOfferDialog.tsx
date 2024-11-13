import EditForm from "../propertyPages/bidding/EditForm";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function EditOfferDialog({
  offerId,
  propertyId,
  originalNightlyBiddingOffer,
  guests,
  checkIn,
  checkOut,
  open,
  onOpenChange,
}: {
  offerId: number;
  propertyId: number;
  originalNightlyBiddingOffer: number;
  guests: number;
  checkIn: Date;
  checkOut: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit offer</DialogTitle>
        <EditForm
          offerId={offerId}
          propertyId={propertyId}
          originalNightlyBiddingOffer={originalNightlyBiddingOffer}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
