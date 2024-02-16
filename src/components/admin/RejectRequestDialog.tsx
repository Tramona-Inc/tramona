import { useState, type PropsWithChildren } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogDescription,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { type RequestWithUser } from "../requests/RequestCard";

export default function RejectRequestDialog({
  children,
  request,
}: PropsWithChildren<{ request: RequestWithUser }>) {
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();
  const mutation = api.requests.resolve.useMutation();

  async function reject() {
    await mutation.mutateAsync({
      id: request.id,
    });
    void utils.requests.invalidate();
    setIsOpen(false);
    toast({
      title: "Sucessfully rejected request",
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to reject this request?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
          <Button
            onClick={() => reject()}
            disabled={mutation.isLoading}
            className="rounded-full"
          >
            Reject
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
