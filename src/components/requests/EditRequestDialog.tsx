import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
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
        <EditRequestForm request={request} setOpen={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
