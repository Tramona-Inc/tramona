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
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full"
              tooltip="Leave group"
            >
              <LogOutIcon className="size-4" />
            </Button>
          </LeaveGroupDialog>
        ) : userIsOwner ? (
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
        ) : null}
      </GroupMember>
    );
  });
}
