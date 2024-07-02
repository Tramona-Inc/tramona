import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type DetailedRequest } from "@/components/requests/RequestCard";


export default function HostFinishRequestDialog({
  open,
  setOpen,
  request,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  request: DetailedRequest;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-3xl space-y-4 p-6">
        We&apos;ve sent your offer to the {request.location}. They have 24 hours to respond.

        <DialogFooter >
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
