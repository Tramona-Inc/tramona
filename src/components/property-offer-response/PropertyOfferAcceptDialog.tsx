import { api } from "@/utils/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "../ui/use-toast";
import { errorToast } from "@/utils/toasts";

export function PropertyOfferAcceptDialog({
  offerId,
  open,
  setOpen,
}: {
  offerId: number;
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const mutation = api.biddings.accept.useMutation();

  async function acceptOffer() {
    await mutation
      .mutateAsync({ bidId: offerId, amount: 0 })
      .then(() => toast({ title: "Successfully accepted offer" }))
      .catch(() => errorToast());

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to accept this offer?</DialogTitle>
        </DialogHeader>
        <p>
          This will auto-reject any conflicting offers and schedule a booking
          for the requested dates.
          {/* TODO: display the conflicting offers */}
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={acceptOffer} disabled={mutation.isLoading}>
            Accept offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
