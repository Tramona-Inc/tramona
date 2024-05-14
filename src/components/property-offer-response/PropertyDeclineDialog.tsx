import { api } from "@/utils/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "../ui/use-toast";

export default function PropertyDeclineDialog({
  offerId,
  open,
  onOpenChange,
}: {
  offerId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate } = api.biddings.reject.useMutation({
    onSuccess: () => {
      toast({
        title: "Offer successfully rejected/declined",
      });
    },
  });

  function handleDecline() {
    mutate({ bidId: offerId });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <Button variant={"secondaryLight"}>Decline</Button>
      </DialogTrigger>
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
          <Button onClick={handleDecline}>Withdraw Offer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
