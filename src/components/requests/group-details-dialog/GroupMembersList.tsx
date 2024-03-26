import { Button } from "../../ui/button";
import { type RequestWithUser, type DetailedRequest } from "../RequestCard";
import { LogOutIcon } from "lucide-react";
import { RemoveFromGroupDialog } from "./RemoveFromGroupDialog";
import { LeaveGroupDialog } from "./LeaveGroupDialog";
import { GroupMember } from "./GroupMember";

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

    const leaveGroupBtn = (
      <LeaveGroupDialog groupId={groupId} userIsOwner={userIsOwner}>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full"
          tooltip="Leave group"
        >
          <LogOutIcon className="size-4" />
        </Button>
      </LeaveGroupDialog>
    );
    const removeFromGroupBtn = (
      <RemoveFromGroupDialog
        groupId={groupId}
        memberId={member.id}
        memberName={member.name}
      >
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full"
          tooltip="Remove from group"
        >
          <LogOutIcon className="size-4" />
        </Button>
      </RemoveFromGroupDialog>
    );

    const groupMemberAction =
      isAdminDashboard || isSingleUser
        ? null
        : isYou
          ? leaveGroupBtn
          : userIsOwner
            ? removeFromGroupBtn
            : null;

    return (
      <GroupMember
        key={member.id}
        member={member}
        isOwner={isOwner}
        isYou={isYou}
        isAdminDashboard={isAdminDashboard}
        isSingleUser={isSingleUser}
      >
        {groupMemberAction}
      </GroupMember>
    );
  });
}
