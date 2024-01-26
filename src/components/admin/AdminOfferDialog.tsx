import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Request } from "@/server/db/schema";
import { useState } from "react";
import AdminOfferForm from "./AdminOfferForm";

export default function AdminOfferDialog({
  children,
  request,
}: React.PropsWithChildren<{ request: Request }>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose className="hidden" />
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Make an offer</DialogTitle>
          <DialogDescription>
            Create a property and give it a total price
          </DialogDescription>
        </DialogHeader>
        <AdminOfferForm
          afterSubmit={() => setIsOpen(false)}
          request={request}
        />
      </DialogContent>
    </Dialog>
  );
}
