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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Edit</DialogTitle>
        <EditRequestForm request={request} />
      </DialogContent>
    </Dialog>
  );
}
