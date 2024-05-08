import { api } from "@/utils/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "../ui/use-toast";
import { errorToast } from "@/utils/toasts";

export function PropertyOfferRejectDialog({
  offerId,
  open,
  setOpen,
}: {
  offerId: number;
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const mutation = api.biddings.reject.useMutation();

  async function rejectOffer() {
    await mutation
      .mutateAsync({ bidId: offerId })
      .then(() => toast({ title: "Successfully rejected offer" }))
      .catch(() => errorToast());

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Are you sure you want to reject this offer?</DialogTitle>
        <DialogDescription>This action can not be undone.</DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={rejectOffer}
            disabled={mutation.isLoading}
          >
            Reject offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
