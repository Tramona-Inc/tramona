import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import AdminOfferForm from "../admin/AdminOfferForm";
import { useState } from "react";

export default function AddUnclaimedOffer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex flex-row gap-x-1">
        <p>Add new offer</p>
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>
        <AdminOfferForm afterSubmit={() => setIsOpen(!isOpen)} />
      </DialogContent>
    </Dialog>
  );
}
