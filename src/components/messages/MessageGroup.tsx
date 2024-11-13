import { type MessageType } from "@/server/db/schema";
import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
import { type MessageGroup } from "./groupMessages";
import { AnonymousAvatar } from "../ui/avatar";
import { cn } from "@/utils/utils";

export function MessageGroup({ messageGroup }: { messageGroup: MessageGroup }) {
  const { data: session } = useSession();
  const { user, messages } = messageGroup;
  const firstMessage = messages[0];
  if (!firstMessage || !session) return null;

  const me = session.user.id === user?.id;

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        me ? "justify-start" : "justify-end",
      )}
    >
      {/* {user ? <UserAvatar {...user} /> : <AnonymousAvatar />} */}
      <div
        className={cn(
          "max-w-72 rounded-xl px-4 py-2 sm:max-w-96 lg:max-w-prose",
          me ? "bg-white" : "bg-teal-900 text-white",
        )}
      >
        {/* <div className="flex items-baseline gap-2">
          {user ? (
            <p className="font-semibold leading-none">{user.name}</p>
          ) : (
            <p className="leading-none text-muted-foreground">[deleted user]</p>
          )}
        </div> */}

        <div className="space-y-1">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>{formatRelative(firstMessage.createdAt, new Date())}</p>
          <p>
            {session.user.id === firstMessage.userId && firstMessage.read && (
              <>Read</>
            )}
          </p>
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
