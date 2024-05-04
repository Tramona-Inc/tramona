import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";

export default function WithdrawPropertyOfferDialog({
  offerId,
  open,
  onOpenChange,
}: {
  offerId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate } = api.biddings.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Offer successfully withdrawn",
      });
    },
  });

  function handleWithdraw() {
    mutate({ id: offerId });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Are you sure you want to withdraw this offer?</DialogTitle>
        <p>
          Your offer will be permanently withdrawn. You can not undo this
          action.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleWithdraw}>Withdraw Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
