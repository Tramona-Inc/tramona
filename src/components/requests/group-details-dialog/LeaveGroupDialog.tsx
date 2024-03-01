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

export function LeaveGroupDialog({
  children,
  groupId,
  userIsOwner,
}: React.PropsWithChildren<{ groupId: number; userIsOwner: boolean }>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const utils = api.useUtils();
  const { mutateAsync } = api.groups.leaveGroup.useMutation();

  async function leaveGroup() {
    setLoading(true);

    await mutateAsync(groupId)
      .then(() => utils.invalidate())
      .then(() => toast({ title: "Left group successfully" }))
      .catch(() => errorToast());

    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} nested>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to leave this group?</DialogTitle>
          <DialogDescription>
            This will remove the request from your dashboard{" "}
            {userIsOwner && <>and transfer ownership to someone else</>}. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => leaveGroup()} disabled={loading}>
            Leave group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
