import { type GuestMessageType, type MessageType } from "@/server/db/schema";
import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
import { type MessageGroup } from "./groupMessages";
import { AnonymousAvatar } from "../ui/avatar";
import { type GuestMessage } from "@/utils/store/messages";

export function MessageGroup({ messageGroup }: { messageGroup: MessageGroup }) {
  const { data: session } = useSession();
  const { user, messages } = messageGroup;
  const firstMessage = messages[0];
  if (!firstMessage || !session) return null;

  return (
    <div className="flex items-start gap-2">
      {user ? <UserAvatar {...user} /> : <AnonymousAvatar />}
      <div>
        <div className="flex items-baseline gap-2">
          {user ? (
            <p className="font-semibold leading-none">{user.name}</p>
          ) : (
            <p className="leading-none text-muted-foreground">[unknown user]</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatRelative(firstMessage.createdAt, new Date())}
            {"userId" in firstMessage && session.user.id === firstMessage.userId && firstMessage.read && (
              <> · read</>
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

function Message({ message }: { message: MessageType | GuestMessageType }) {
  return (
    <p>
      {message.message}
      {message.isEdit && (
        <span className="ml-1 text-xs text-muted-foreground">(edited)</span>
      )}
    </p>
  );
}
