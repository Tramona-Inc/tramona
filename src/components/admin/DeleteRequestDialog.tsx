import { useState, type PropsWithChildren } from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { errorToast } from "@/utils/toasts";

export default function DeleteRequestDialog({
  children,
  requestId,
}: PropsWithChildren<{ requestId: number }>) {
  const [isOpen, setIsOpen] = useState(false);

  const mutation = api.requests.delete.useMutation();

  async function deleteRequest() {
    await mutation
      .mutateAsync({ id: requestId })
      .then(() => toast({ title: "Sucessfully deleted request" }))
      .catch(() => errorToast());
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this request?
          </DialogTitle>
          <DialogDescription>
            This will also delete all associated offers. This can not be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={() => deleteRequest()} disabled={mutation.isLoading}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
