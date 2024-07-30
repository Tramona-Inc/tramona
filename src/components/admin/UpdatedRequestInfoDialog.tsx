import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Request } from "@/server/db/schema";
import { useState } from "react";
import UpdatedRequestInfo from "./UpdatedRequestInfo";
import { type OfferWithProperty } from "../requests/[id]/OfferCard";

export default function AdminOfferDialog({
  children,
  request,
}: React.PropsWithChildren<{ request: Request; offer?: OfferWithProperty }>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose className="hidden" />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader></DialogHeader>
        <UpdatedRequestInfo request={request} />
      </DialogContent>
    </Dialog>
  );
}
