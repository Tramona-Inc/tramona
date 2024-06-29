import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import AdminOfferForm from "../admin/AdminOfferForm";

export default function AddUnclaimedOffer() {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-row gap-x-1">
        <p>Add new offer</p>
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>{/* <AdminOfferForm /> */}</DialogContent>
    </Dialog>
  );
}
