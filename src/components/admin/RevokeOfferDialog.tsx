import { useState, type PropsWithChildren } from "react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";
import { errorToast } from "@/utils/toasts";

export default function RevokeOfferDialog(
  props: PropsWithChildren<{
    requestCreatedAt: Date;
    propertyName: string;
    propertyAddress: string;
    userPhoneNumber: string;
    offerId: number;
  }>,
) {
  const [isOpen, setIsOpen] = useState(false);

  const utils = api.useUtils();
  const mutation = api.offers.delete.useMutation();

  async function deleteOffer() {
    await mutation
      .mutateAsync({ id: props.offerId })
      .then(() => utils.offers.invalidate())
      .then(() => toast({ title: "Sucessfully revoked offer" }))
      .catch(() => errorToast())
      .finally(() => setIsOpen(false));
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to revoke this offer?</DialogTitle>
          <DialogDescription>This can not be undone.</DialogDescription>
        </DialogHeader>
        {JSON.stringify({
          requestCreatedAt: props.requestCreatedAt,
          propertyName: props.propertyName,
          propertyAddress: props.propertyAddress,
          userPhoneNumber: props.userPhoneNumber,
          offerId: props.offerId,
        })}
        <DialogFooter>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outline"
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={() => deleteOffer()}
            disabled={mutation.isLoading}
            className="rounded-full"
          >
            Revoke
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
