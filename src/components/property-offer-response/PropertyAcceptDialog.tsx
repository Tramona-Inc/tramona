import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import AcceptForm from "./AcceptForm";

export function PropertyAcceptDialog({
  offerId,
  open,
  setOpen,
  counterNightlyPrice,
}: {
  offerId: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  counterNightlyPrice: number;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Accept</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Accept Offer</DialogTitle>
        </DialogHeader>
        <AcceptForm
          offerId={offerId}
          setOpen={setOpen}
          counterNightlyPrice={counterNightlyPrice}
        />
      </DialogContent>
    </Dialog>
  );
}
