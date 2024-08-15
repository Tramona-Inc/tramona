import { api } from "@/utils/api";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
import { formatRelative } from "date-fns";

export function SidebarConversation({
  conversation,
  isSelected,
  setSelected,
}: {
  conversation: Conversation;
  isSelected: boolean;
  setSelected: (arg0: Conversation) => void;
}) {
  const { participants, messages, id, name } = conversation;

  const displayParticipants = participants
    .map((participant) => participant.name ?? participant.id)
    .join(", ");

  const { data: session } = useSession();

  const { mutateAsync: setMessageToReadMutate } =
    api.messages.setMessageToRead.useMutation();

  const setConversationReadState = useConversation(
    (state) => state.setConversationReadState,
  );

  function handleSelected() {
    if (
      session?.user.id !== messages[0]?.userId &&
      messages[0]?.id &&
      !messages[0].read
    ) {
      void setMessageToReadMutate({ messageId: messages[0]?.id });
    }
    // Update local state to true
    setConversationReadState(conversation.id);

    setSelected(conversation);
  }

  return (
    <button
      className={cn(
        "relative flex min-h-20 w-full gap-4 rounded-lg p-2 text-left",
        isSelected ? "bg-zinc-100" : "hover:bg-zinc-50",
      )}
      onClick={() => handleSelected()}
    >
      <UserAvatar
        email={participants[0]?.email}
        image={participants[0]?.image}
        name={participants[0]?.name}
      />

      <div className="flex-1">
        <div className="flex">
          <p className="line-clamp-1 flex-1 overflow-clip font-semibold">
            {displayParticipants}
          </p>
          {messages[0] && (
            <p className="text-xs text-muted-foreground">
              {formatRelative(messages[0].createdAt, new Date())}
            </p>
          )}
        </div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {messages[0] &&
            !messages[0].read &&
            messages[0].userId !== session?.user.id && (
              <div className="mr-1 inline-block size-2 rounded-full bg-blue-500" />
            )}
          <span className="font-semibold">
            {messages[0]?.userId === session?.user.id ? "You: " : ""}
          </span>
          {messages[0]?.message ?? ""}
        </p>
        {/* {session?.user.role === "admin" && (
          <p className="line-clamp-1 text-xs uppercase text-muted-foreground">
            Conversation Id: {id}
          </p>
        )} */}
      </div>
    </button>
  );
}
