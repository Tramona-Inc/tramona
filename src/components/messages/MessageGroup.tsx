import { type MessageType } from "@/server/db/schema";
import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
import { type MessageGroup } from "./groupMessages";

export function MessageGroup({ messageGroup }: { messageGroup: MessageGroup }) {
  const { data: session } = useSession();
  const { user, messages } = messageGroup;
  const firstMessage = messages[0];
  if (!firstMessage || !session) return null;

  // Helps convert UTC time to local time offset
  const utcTime = new Date(firstMessage.createdAt);
  const localOffset = utcTime.getTimezoneOffset();
  const localTime = new Date(utcTime.getTime() - localOffset * 60000); // Adjust for local time zone offset

  return (
    <div className="flex items-start gap-2">
      <UserAvatar {...user} />
      <div>
        <div className="flex items-baseline gap-2">
          <p className="font-semibold leading-none">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatRelative(localTime, new Date())}
            {session.user.id === firstMessage.userId && firstMessage.read && (
              <> • read</>
            )}
          </p>
        </div>

        <div className="space-y-1">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Message({ message }: { message: MessageType }) {
  return (
    <p>
      {message.message}
      {message.isEdit && (
        <span className="ml-1 text-xs text-muted-foreground">(edited)</span>
      )}
    </p>
  );
}
