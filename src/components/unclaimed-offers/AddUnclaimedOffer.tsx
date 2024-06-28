import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { PlusIcon } from "lucide-react";

export default function AddUnclaimedOffer() {
  const { mutateAsync: addOffer } = api.offers.create.useMutation();

  return (
    <Dialog>
      <DialogTrigger className="flex flex-row gap-x-1">
        <p>Add new offer</p>
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>It works</DialogContent>
    </Dialog>
  );
}
