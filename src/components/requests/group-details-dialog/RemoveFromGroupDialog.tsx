import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { api } from "@/utils/api";
import { toast } from "../../ui/use-toast";
import React, { useState } from "react";
import { errorToast } from "@/utils/toasts";

export function RemoveFromGroupDialog({
  children,
  groupId,
  memberId,
  memberName,
}: React.PropsWithChildren<{
  groupId: number;
  memberId: string;
  memberName: string | null;
}>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const utils = api.useUtils();
  const { mutateAsync } = api.groups.removeGroupMember.useMutation();

  async function removeGroupMember() {
    setLoading(true);

    await mutateAsync({ groupId, memberId })
      .then(() => utils.invalidate())
      .then(() =>
        toast({
          title: `Successfully removed ${memberName ?? "member"} from the group`,
        }),
      )
      .catch(() => errorToast());

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to remove this user?</DialogTitle>
          <DialogDescription>
            This will remove the request from their dashboard. You can still add
            them back to the group later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => removeGroupMember()} disabled={loading}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
