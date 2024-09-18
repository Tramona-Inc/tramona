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

  const mutation = api.groups.removeGroupMember.useMutation();

  async function removeGroupMember() {
    await mutation
      .mutateAsync({ groupId, memberId })
      .then(() =>
        toast({
          title: `Successfully removed ${memberName ?? "member"} from the group`,
        }),
      )
      .catch(() => errorToast());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to remove this user?</DialogTitle>
          <DialogDescription>
            This will remove the request from their dashboard. You can add them
            back if you change your mind.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => removeGroupMember()}
            disabled={mutation.isLoading}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
