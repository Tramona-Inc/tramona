import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import CounterForm from "./CounterForm";

export function PropertyCounterDialog({
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
        <Button variant={"outline"}>Re-counter</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Counter Offer</DialogTitle>
        </DialogHeader>
        <CounterForm
          offerId={offerId}
          setOpen={setOpen}
          counterNightlyPrice={counterNightlyPrice}
        />
      </DialogContent>
    </Dialog>
  );
}
