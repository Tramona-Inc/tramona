import { type MessageType } from "@/server/db/schema";
import { type MessageDbType } from "@/types/supabase.message";
import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
import { type MessageGroup } from "./groupMessages";
import { AnonymousAvatar } from "../ui/avatar";
import supabase from "@/utils/supabase-client";
import { useEffect } from "react";

export function MessageGroup({ messageGroup }: { messageGroup: MessageGroup }) {
  const { data: session } = useSession();
  const { user, messages } = messageGroup;
  const firstMessage = messages[0];
  if (!firstMessage || !session) return null;  

  // useEffect(() => {
  //   const channel = supabase
  //   .channel(`${firstMessage.conversationId}`)
  //   .on('postgres_changes',
  //     {
  //       event: "UPDATE",
  //       schema: 'public',

  //     }
  //   )
  // })

  return (
    <div className="flex items-start gap-2">
      {user ? <UserAvatar {...user} /> : <AnonymousAvatar />}
      <div>
        <div className="flex items-baseline gap-2">
          {user ? (
            <p className="font-semibold leading-none">{user.name}</p>
          ) : (
            <p className="leading-none text-muted-foreground">[deleted user]</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formatRelative(firstMessage.createdAt, new Date())}
            {session.user.id === firstMessage.userId && firstMessage.read && (
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
