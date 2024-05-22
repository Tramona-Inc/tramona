import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "../ui/use-toast";

export default function EditOfferDialog({
  offerId,
  open,
  onOpenChange,
}: {
  offerId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = api.biddings.delete.useMutation();

  async function handleWithdraw() {
    await mutation
      .mutateAsync({ id: offerId })
      .then(() => toast({ title: "Offer successfully withdrawn" }))
      .catch(() => errorToast());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit</DialogTitle>
        <p>
          Your offer will be permanently withdrawn. You can not undo this
          action.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleWithdraw}
            disabled={mutation.isLoading}
          >
            Withdraw Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
