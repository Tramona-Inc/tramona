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
import { useSession } from "next-auth/react";
import React from "react";
import GroupMembersList from "./GroupMembersList";
import { InviteByEmailForm } from "./InviteByEmailForm";
import GroupInviteesList from "./GroupInviteesList";
import {
  getRequestWithGroupDetails,
  type RequestWithGroup,
} from "../RequestGroupAvatars";

export default function GroupDetailsDialog({
  children,
  request,
  isAdminDashboard,
}: React.PropsWithChildren<{
  request: RequestWithGroup;
  isAdminDashboard?: boolean;
}>) {
  const { data: session } = useSession({ required: true });
  if (!session) return null;

  const { userIsOwner, isSingleUser, isInviteDialog } =
    getRequestWithGroupDetails({
      request,
      isAdminDashboard: !!isAdminDashboard,
      userId: session.user.id,
    });

  const showInviteForm = !isAdminDashboard && userIsOwner; // still show it after everyone is invited, just disabled

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {isInviteDialog ? (
              <>Invite people</>
            ) : (
              <>{isSingleUser ? "User" : "Group"} details</>
            )}
          </DialogTitle>
          {isInviteDialog && (
            <DialogDescription>
              Add your travelling companions so they can stay up to date with
              offers
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {showInviteForm && <InviteByEmailForm request={request} />}
          <div className="min-h-44 space-y-4">
            <div className="space-y-1">
              {request.numGuests > 1 && (
                <p className="text-sm font-semibold uppercase text-muted-foreground">
                  Current group members ({request.madeByGroup.members.length})
                </p>
              )}
              <GroupMembersList
                request={request}
                userId={session.user.id}
                isAdminDashboard={isAdminDashboard}
              />
            </div>
            {!isAdminDashboard && request.madeByGroup.invites.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase text-muted-foreground">
                  Pending invites ({request.madeByGroup.invites.length})
                </p>
                <GroupInviteesList
                  request={request}
                  userId={session.user.id}
                  isAdminDashboard={isAdminDashboard}
                />
              </div>
            )}
          </div>
        </div>
        {isAdminDashboard && (
          <DialogFooter>
            <DialogClose asChild>
              <Button>Done</Button>
            </DialogClose>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
