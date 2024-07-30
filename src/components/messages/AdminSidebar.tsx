import { api } from "@/utils/api";
import {
  type Conversation,
  useConversation,
  type AdminConversation,
} from "@/utils/store/conversations";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { formatRelative } from "date-fns";
import { Avatar, AvatarFallback } from "../ui/avatar";

export function AdminSidebar({
  adminConversation,
  isSelected,
  setSelected,
}: {
  adminConversation: AdminConversation;
  isSelected: boolean;
  setSelected: (arg0: AdminConversation | Conversation) => void;
}) {
  const { guest_participants, guest_messages, name } = adminConversation;

  const displayParticipants = guest_participants
    .map((participant) => participant.userToken)
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
      session?.user.id !== guest_messages[0]?.userToken &&
      guest_messages[0]?.id &&
      !guest_messages[0].read
    ) {
      void setMessageToReadMutate({ messageId: guest_messages[0]?.id });
    }
    // Update local state to true
    setConversationReadState(adminConversation.id);

    setSelected(adminConversation);
  }

  return (
    <button
      className={cn(
        "relative flex min-h-20 w-full gap-4 rounded-lg p-2 text-left",
        isSelected ? "bg-zinc-100" : "hover:bg-zinc-50",
      )}
      onClick={() => handleSelected()}
    >
    <Avatar>
      <AvatarFallback />
    </Avatar>

      <div className="flex-1">
        <div className="flex">
          <p className="line-clamp-1 flex-1 overflow-clip font-semibold">
            {displayParticipants}
          </p>
          {guest_messages[0] && (
            <p className="text-xs text-muted-foreground">
              {formatRelative(guest_messages[0].createdAt, new Date())}
            </p>
          )}
        </div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {guest_messages[0] &&
            !guest_messages[0].read &&
            guest_messages[0].userToken !== session?.user.id && (
              <div className="mr-1 inline-block size-2 rounded-full bg-blue-500" />
            )}
          <span className="font-semibold">
            {guest_messages[0]?.userToken === session?.user.id ? "You: " : ""}
          </span>
          {guest_messages[0]?.message ?? ""}
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
