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
import { type RequestWithUser, type DetailedRequest } from "../RequestCard";
import { useSession } from "next-auth/react";
import React from "react";
import GroupMembersList from "./GroupMembersList";
import { InviteByEmailForm } from "./InviteByEmailForm";
import GroupInviteesList from "./GroupInviteesList";

export default function GroupDetailsDialog({
  children,
  request,
  isAdminDashboard,
}: React.PropsWithChildren<{
  request: DetailedRequest | RequestWithUser;
  isAdminDashboard?: boolean;
}>) {
  const { data: session } = useSession({ required: true });
  if (!session) return null;

  const userIsOwner = request.groupMembers.some(
    (member) => member.isGroupOwner && member.id === session.user.id,
  );
  const isEveryoneInvited = request.groupMembers.length >= request.numGuests;
  const isInviteDialog = !isAdminDashboard && userIsOwner && !isEveryoneInvited;
  const showInviteForm = !isAdminDashboard && userIsOwner; // still show it after everyone is invited, just disabled
  const isSingleUser = request.groupMembers.length === 1;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
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
                  Current group members ({request.groupMembers.length})
                </p>
              )}
              <GroupMembersList
                request={request}
                userId={session.user.id}
                isAdminDashboard={isAdminDashboard}
              />
            </div>
            {!isAdminDashboard && request.groupInvites.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase text-muted-foreground">
                  Pending invites ({request.groupInvites.length})
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
