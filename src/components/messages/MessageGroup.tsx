import { type MessageType, type FlaggedMessageType } from "@/server/db/schema";
import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import { type MessageGroup } from "./groupMessages";
import { capitalize, cn } from "@/utils/utils";
import { AnonymousAvatar } from "../ui/avatar";
import UserAvatar from "../_common/UserAvatar";
import { useRouter } from "next/router";

export function MessageGroup({ messageGroup }: { messageGroup: MessageGroup }) {
  const { data: session } = useSession();
  const { user, messages } = messageGroup;
  const firstMessage = messages[0];
  const router = useRouter();
  if (!firstMessage || !session) return null;
  const me = session.user.id === user?.id;

  return (
    <div
      className={cn(
        "flex items-start gap-2",
        me ? "justify-end" : "justify-start",
      )}
    >
      {user ? <UserAvatar {...user} onClick={() => router.push(`/profile/view/${user.id}`)} /> : <AnonymousAvatar />}
      <div
        className={cn(
          "max-w-72 rounded-xl px-4 py-2 sm:max-w-96 lg:max-w-prose",
          me ? "bg-teal-900 text-white" : "bg-white",
        )}
      >
        {!me && (
          <p className="mb-1 text-sm text-gray-500">
            {user ? `${capitalize(user.firstName!)}` : "[deleted user]"}
          </p>
        )}

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

function Message({ message }: { message: MessageType | FlaggedMessageType }) {
  if ("violationType" in message) {
    return (
      <div className="relative">
        <p className="select-none blur-sm">
          {message.message}
        </p>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
          <span className="text-sm text-white">
            This message has been flagged for potential policy violation.
          </span>
        </div>
      </div>
    );
  }

  return (
    <p>
      {message.message}
      {message.isEdit && (
        <span className="ml-1 text-xs text-muted-foreground">(edited)</span>
      )}
    </p>
  );
}
