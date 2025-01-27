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
import { errorToast } from "@/utils/toasts";

export default function WithdrawRequestDialog({
  requestId,
  open,
  onOpenChange,
}: {
  requestId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = api.requests.withdraw.useMutation();

  async function handleWithdraw() {
    await mutation
      .mutateAsync({ id: requestId })
      .then(() => toast({ title: "Request successfully withdrawn" }))
      .catch(() => errorToast());
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
          <Button
            variant="destructive"
            onClick={handleWithdraw}
            disabled={mutation.isLoading}
          >
            Withdraw Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
