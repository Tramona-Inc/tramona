import { type Conversation } from "@/pages/messages";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
import { Icons } from "../_icons/icons";

export function MessageConversation({
  conversation,
  isSelected,
  setSelected,
}: {
  conversation: Conversation;
  isSelected: boolean;
  setSelected: (arg0: Conversation) => void;
}) {
  const { participants, messages, id } = conversation;

  const displayParticipants = participants
    .map((participant) => participant.name)
    .join(", ");

  const { data: session } = useSession();

  return (
    <div
      className={cn(
        "flex items-center justify-start border-b-2 border-zinc-100 px-4 py-6 hover:cursor-pointer hover:bg-zinc-200 lg:p-8",
        isSelected && "bg-zinc-100",
      )}
      onClick={() => setSelected(conversation)}
    >
      <UserAvatar
        email={participants[0]?.email ?? ""}
        image={participants[0]?.image ?? ""}
        name={participants[0]?.name ?? ""}
      />

      <div className="ml-4 md:ml-2">
        <h1 className="text-xl font-bold">{displayParticipants}</h1>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {messages[0]?.message ?? ""}
        </p>
        {session?.user.role === "admin"}{" "}
        {
          <p className="line-clamp-1 text-sm uppercase text-muted-foreground">
            Conversation Id: {id}
          </p>
        }
      </div>
    </div>
  );
}

export type SidebarProps = {
  selectedConversation: Conversation | null;
  setSelected: (arg0: Conversation) => void;
};

export default function MessagesSidebar({
  selectedConversation,
  setSelected,
}: SidebarProps) {
  const { data: conversations, isLoading } =
    api.messages.getConversations.useQuery();

  return (
    <div
      className={cn(
        "col-span-1 block md:col-span-2 md:border-r-2 xl:col-span-1",
        selectedConversation && "hidden md:block",
      )}
    >
      <h1 className="flex h-[100px] w-full items-center border-b-2 p-4 text-4xl font-bold md:text-2xl md:font-semibold lg:p-8">
        Messages
      </h1>

      {!isLoading ? (
        conversations && conversations.length > 0 ? (
          conversations.map((conversation) => (
            <MessageConversation
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              setSelected={setSelected}
            />
          ))
        ) : (
          <p className="p-4 text-muted-foreground lg:p-8">
            No messages to show!
          </p>
        )
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Icons.loading />
        </div>
      )}
    </div>
  );
}
