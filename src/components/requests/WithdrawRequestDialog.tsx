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

export default function WithdrawRequestDialog({
  requestId,
  open,
  onOpenChange,
}: {
  requestId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate } = api.requests.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Request successfully withdrawn",
      });
    },
  });

  function handleWithdraw() {
    mutate({ id: requestId });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          Are you sure you want to withdraw this request?
        </DialogTitle>
        <p>
          Your request will be permanently withdrawn. You can not undo this
          action.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleWithdraw}>Withdraw Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
