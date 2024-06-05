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
import EditRequestForm from "./EditRequestForm";
import { type DetailedRequest, type RequestWithUser } from "./RequestCard";

export default function EditRequestDialog({
  request,
  open,
  onOpenChange,
}: {
  request: DetailedRequest | RequestWithUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = api.requests.delete.useMutation();

  async function handleWithdraw() {
    await mutation
      .mutateAsync({ id: request.id })
      .then(() => toast({ title: "Request successfully withdrawn" }))
      .catch(() => errorToast());
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit</DialogTitle>
        <EditRequestForm request={request} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"secondary"}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleWithdraw} disabled={mutation.isLoading}>
            Withdraw Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
