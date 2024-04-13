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
import { type Request } from "@/server/db/schema";

export default function RejectRequestDialog({
  children,
  request,
}: PropsWithChildren<{
  request: Pick<Request, "checkIn" | "checkOut" | "location" | "id">;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const mutation = api.requests.resolve.useMutation();

  async function rejectRequest() {
    await mutation
      .mutateAsync({ id: request.id })
      .then(() => toast({ title: "Sucessfully rejected request" }))
      .catch(() => errorToast());
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to reject this request?
          </DialogTitle>
          <DialogDescription>This can not be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={() => rejectRequest()}
            disabled={mutation.isLoading}
            className="rounded-full"
          >
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
