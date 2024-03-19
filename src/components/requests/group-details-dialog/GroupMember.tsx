import UserAvatar from "../../_common/UserAvatar";
import React from "react";
import { type User } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";

function GroupOwnerIcon() {
  return (
    <Badge variant="secondary" size="sm">
      Group owner
    </Badge>
  );
}

export function GroupMember({
  member,
  isYou,
  isOwner,
  isAdminDashboard,
  isSingleUser,
  children,
}: React.PropsWithChildren<{
  member: Partial<Pick<User, "name" | "email" | "image">>;
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
