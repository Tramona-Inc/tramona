import { Dialog, DialogContent } from "../ui/dialog";

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
        <p>todo</p>
      </DialogContent>
    </Dialog>
  );
}
