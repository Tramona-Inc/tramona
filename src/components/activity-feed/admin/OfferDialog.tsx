import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import CreateOfferForm from "./OfferForm";
import {type OfferCardDataType} from "@/components/activity-feed/ActivityFeed";
import { toast } from '@/components/ui/use-toast';
import { api } from "@/utils/api";
import { errorToast } from '@/utils/toasts';
import { Button } from "@/components/ui/button";

export default function CreateOfferDialog({
  children,
  offer,
}: React.PropsWithChildren<{offer?: OfferCardDataType}>) {
  const [isOpen, setIsOpen] = useState(false);
const deleteFillerOffer = api.feed.deleteFillerOffer .useMutation();

  async function deleteOffer () {
    if (!offer ) return;
    await deleteFillerOffer
      .mutateAsync({ id: offer ?.id })
      .then(() => toast({ title: "Sucessfully deleted offer" }))
      .catch(() => errorToast());
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogClose className="hidden" />
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{offer? "Update" : "Create"} a filler offer </DialogTitle>
          <DialogDescription>
            {offer ? "Update" : "Create"} a filler offer 
          </DialogDescription>
          <div className="flex flex-row justify-end">
          {offer  && 
            <Button
              onClick={() => deleteOffer()}
              className="rounded-full"
              variant={"outline"}
            >
              Delete
            </Button>
          }
          </div>
        </DialogHeader>
        <CreateOfferForm
          afterSubmit={() => setIsOpen(false)}
          offer={offer}
        />
        
      </DialogContent>
    </Dialog>
  );
}
