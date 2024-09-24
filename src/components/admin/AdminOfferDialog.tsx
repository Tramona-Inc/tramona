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
import { type OfferWithProperty } from "../requests/[id]/OfferCard";

export default function AdminOfferDialog({
  children,
  request,
  offer,
}: React.PropsWithChildren<{ request: Request; offer?: OfferWithProperty }>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose className="hidden" />
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{offer ? "Update" : "Make an"} offer</DialogTitle>
          <DialogDescription>
            Create a property and give it a total price
          </DialogDescription>
        </DialogHeader>
        <AdminOfferForm
         afterSubmit={() => setIsOpen(false)}
          request={request}
          offer={offer}
        /> 
      </DialogContent>
    </Dialog>
  );
}
