import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
import { type MessageType } from "@/server/db/schema";
import { type MessageGroup } from "./groupMessages";

export function MessageGroup({ messageGroup }: { messageGroup: MessageGroup }) {
  const { data: session } = useSession();
  const { user, messages } = messageGroup;
  const firstMessage = messages[0];
  if (!firstMessage || !session) return null;

  return (
    <div className="flex items-start gap-2">
      <UserAvatar {...user} />
      <div>
        <div className="flex items-baseline gap-2">
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatRelative(firstMessage.createdAt, new Date())}
            {session.user.id === firstMessage.userId && firstMessage.read && (
              <> • read</>
            )}
          </p>
        </div>

        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
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
