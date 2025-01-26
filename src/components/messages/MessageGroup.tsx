import { type MessageType } from "@/server/db/schema";
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
      <div className="flex flex-row items-start gap-x-2">
        {!me &&
          (user ? (
            <div className="mt-7">
              <UserAvatar
                {...user}
                onClick={() => router.push(`/profile/view/${user.id}`)}
              />
            </div>
          ) : (
            <AnonymousAvatar />
          ))}
        <div
          className={cn(
            "flex flex-col items-start gap-1",
            me ? "justify-end" : "justify-start",
          )}
        >
          {!me && (
            <p className="ml-3 text-start text-sm text-gray-600">
              {user ? `${capitalize(user.firstName!)}` : "[deleted user]"}
            </p>
          )}
          <div
            className={cn(
              "max-w-72 rounded-xl px-4 py-2 sm:max-w-96 lg:max-w-prose",
              me ? "bg-teal-900 text-white" : "bg-zinc-100",
            )}
          >
            <div className="space-y-1">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
            <div
              className={`flex items-center justify-between gap-2 text-xs ${me ? "text-zinc-300" : "text-muted-foreground"}`}
            >
              <p>{formatRelative(firstMessage.createdAt, new Date())}</p>
              <p>
                {session.user.id === firstMessage.userId &&
                  firstMessage.read && <>Read</>}
              </p>
            </div>
          </div>
        </div>
        {me &&
          (user.image ? (
            <div className="mt-2">
              <UserAvatar
                {...user}
                onClick={() => router.push(`/profile/view/${user.id}`)}
              />
            </div>
          ) : (
            <AnonymousAvatar />
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
