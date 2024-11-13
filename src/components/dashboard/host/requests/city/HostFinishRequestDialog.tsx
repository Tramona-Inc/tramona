/* HostFinishRequestDialog.tsx */
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type HostDashboardRequest } from "@/components/requests/RequestCard";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { CheckCircleIcon } from "lucide-react"; // Assuming you're using Lucide icons

export default function HostFinishRequestDialog({
  open,
  setOpen,
  request,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  request: HostDashboardRequest;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogDescription className="sr-only">
        You have successfully sent out your offers!
      </DialogDescription>
      <DialogContent className="max-w-lg space-y-4 p-6">
        <DialogClose className="absolute right-2 top-2" />
        <EmptyState icon={CheckCircleIcon} className="mt-4 gap-4">
          <EmptyStateTitle className="text-center">Success!</EmptyStateTitle>
          <EmptyStateDescription className="text-center text-muted-foreground">
            {/* TODO: add request owner name */}
            We&apos;ve sent your offer for {request.location}. They have 24
            hours to respond.
          </EmptyStateDescription>
        </EmptyState>
        <DialogFooter className="pt-6">
          <Button onClick={() => setOpen(false)} className="w-full">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
