import { api } from "@/utils/api";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";

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
    .map((participant) => participant.name)
    .filter(Boolean)
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
        "relative flex min-h-24 w-full items-center gap-4 border-b p-4 text-left",
        isSelected ? "bg-zinc-100" : "hover:bg-zinc-100",
      )}
      onClick={() => handleSelected()}
    >
      {isSelected && (
        <motion.div
          layoutId="messages-sidebar-indicator"
          transition={{ duration: 0.1, ease: "circOut" }}
          className="absolute inset-y-0 right-0 border-[3px] border-transparent border-r-black"
        />
      )}
      <UserAvatar
        email={participants[0]?.email ?? ""}
        image={participants[0]?.image ?? ""}
        name={participants[0]?.name ?? ""}
      />

      <div>
        <p className="font-semibold">{displayParticipants}</p>
        <p className="text-sm font-semibold">{name}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {messages.length > 0 &&
            !messages[0]?.read &&
            messages[0]?.userId !== session?.user.id && (
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
