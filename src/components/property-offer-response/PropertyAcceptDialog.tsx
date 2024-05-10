import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import AcceptForm from "./AcceptForm";

export function PropertyAcceptDialog({
  offerId,
  open,
  setOpen,
  counterNightlyPrice,
  totalCounterAmount,
}: {
  offerId: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  counterNightlyPrice: number;
  totalCounterAmount: number,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant={'greenPrimary'}>Accept</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Accept Offer</DialogTitle>
        </DialogHeader>
        <AcceptForm
          offerId={offerId}
          setOpen={setOpen}
          counterNightlyPrice={counterNightlyPrice}
          totalCounterAmount={totalCounterAmount}
        />
      </DialogContent>
    </Dialog>
  );
}
