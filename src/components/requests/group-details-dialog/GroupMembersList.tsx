import { Button } from "../../ui/button";
import { LogOutIcon } from "lucide-react";
import { RemoveFromGroupDialog } from "./RemoveFromGroupDialog";
import { LeaveGroupDialog } from "./LeaveGroupDialog";
import { GroupMember } from "./GroupMember";
import {
  getRequestWithGroupDetails,
  type RequestWithGroup,
} from "../RequestGroupAvatars";

export default function GroupMembersList({
  request,
  userId,
  isAdminDashboard = false,
}: {
  request: RequestWithGroup;
  userId?: string;
  isAdminDashboard?: boolean;
}) {
  const { userIsOwner } = getRequestWithGroupDetails({ request, userId });
  const isSingleUser = request.madeByGroup.members.length === 1;
  const groupId = request.madeByGroup.id;

  const leaveGroupBtn = (
    <LeaveGroupDialog groupId={groupId} userIsOwner={userIsOwner}>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full"
        tooltip="Leave group"
      >
        <LogOutIcon className="h-4 w-4" />
      </Button>
    </LeaveGroupDialog>
  );

  return request.madeByGroup.members.map((member) => {
    const isYou = userId === member.userId;
    const isOwner = member.userId === request.madeByGroup.ownerId;

    const removeFromGroupBtn = (
      <RemoveFromGroupDialog
        groupId={groupId}
        memberId={member.user.id}
        memberName={member.user.name}
      >
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full"
          tooltip="Remove from group"
        >
          <LogOutIcon className="h-4 w-4" />
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
        key={member.user.id}
        member={member.user}
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
