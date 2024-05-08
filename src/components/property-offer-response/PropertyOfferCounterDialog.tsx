import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from '../ui/label';

export function PropertyOfferCounterDialog({
  offerId,
  open,
  setOpen,
}: {
  offerId: number;
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Counter Offer</DialogTitle>
        </DialogHeader>
        <div>
          <Label>Your counter offer price</Label>
          <Input type='number' />
        </div>
      </DialogContent>
    </Dialog>
  );
}
