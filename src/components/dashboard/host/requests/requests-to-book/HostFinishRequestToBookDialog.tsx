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
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateTitle,
} from "@/components/ui/empty-state";
import { CheckCircleIcon } from "lucide-react";
import { HostDashboardRequestToBook } from "@/components/requests-to-book/RequestToBookCard";

export default function HostFinishRequestToBookDialog({
  open,
  setOpen,
  requestToBook,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  requestToBook: HostDashboardRequestToBook;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle></DialogTitle>
      <DialogDescription className="sr-only">
        You have successfully rented out your property!
      </DialogDescription>
      <DialogContent className="max-w-lg space-y-4 p-6">
        <DialogClose className="absolute right-2 top-2" />
        <EmptyState icon={CheckCircleIcon} className="mt-4 gap-4">
          <EmptyStateTitle className="text-center">Success!</EmptyStateTitle>
          <EmptyStateDescription className="text-center text-muted-foreground">
            {/* TODO: add request owner name */}
            We&apos;ve created a booking for {requestToBook.property.name}.
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
