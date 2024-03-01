import { Button } from "../../ui/button";
import { type RequestWithUser, type DetailedRequest } from "../RequestCard";
import UserAvatar from "../../_common/UserAvatar";
import { LogOutIcon } from "lucide-react";
import React from "react";
import { type User } from "@/server/db/schema";
import { RemoveFromGroupDialog } from "./RemoveFromGroupDialog";
import { LeaveGroupDialog } from "./LeaveGroupDialog";
import { Badge } from "@/components/ui/badge";

export default function GroupMembersList({
  request,
  userId,
  isAdminDashboard = false,
}: {
  request: DetailedRequest | RequestWithUser;
  userId?: string;
  isAdminDashboard?: boolean;
}) {
  const userIsOwner =
    userId === request.groupMembers.find((member) => member.isGroupOwner)!.id;

  const groupId = request.madeByGroupId;

  const isSingleUser = request.groupMembers.length === 1;

  return request.groupMembers.map((member) => {
    const isYou = userId === member.id;
    const isOwner = member.isGroupOwner;

    const actionBtn = userIsOwner ? (
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full"
        tooltip={isYou ? "Leave group" : "Remove from group"}
      >
        <LogOutIcon className="size-4" />
      </Button>
    ) : null;

    return (
      <GroupMember
        key={member.id}
        member={member}
        isOwner={isOwner}
        isYou={isYou}
        isAdminDashboard={isAdminDashboard}
        isSingleUser={isSingleUser}
      >
        {isAdminDashboard || isSingleUser ? null : isYou ? (
          <LeaveGroupDialog groupId={groupId} userIsOwner={userIsOwner}>
            {actionBtn}
          </LeaveGroupDialog>
        ) : (
          <RemoveFromGroupDialog
            groupId={groupId}
            memberId={member.id}
            memberName={member.name}
          >
            {actionBtn}
          </RemoveFromGroupDialog>
        )}
      </GroupMember>
    );
  });
}

function GroupMember({
  member,
  isYou,
  isOwner,
  isAdminDashboard,
  isSingleUser,
  children,
}: React.PropsWithChildren<{
  member: Pick<User, "name" | "email" | "image">;
  isYou: boolean;
  isOwner: boolean;
  isAdminDashboard: boolean;
  isSingleUser: boolean;
}>) {
  return (
    <div className="flex items-center gap-4 py-2">
      <UserAvatar
        name={member.name}
        email={member.email}
        image={member.image}
      />
      <div className="flex-1 -space-y-1 font-medium">
        <div>
          {member.name ?? member.email ?? ""}{" "}
          {!isAdminDashboard && isYou && (
            <span className="text-muted-foreground">(You)</span>
          )}{" "}
          {isOwner && !isSingleUser && <GroupOwnerIcon />}
        </div>
        <p className="text-sm text-muted-foreground">
          {member.name ? member.email : ""}
        </p>
      </div>
      {children}
    </div>
  );
}

export function GroupOwnerIcon() {
  return (
    <Badge variant="secondary" size="sm">
      Group owner
    </Badge>
  );
}
