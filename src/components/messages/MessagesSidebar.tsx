import { type MessageDbType } from "@/types/supabase.message";
import { api } from "@/utils/api";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { cn, useUpdateUser } from "@/utils/utils";
import { subHours } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import MessageEmptySvg from "../_common/EmptyStateSvg/MessageEmptySvg";
import Spinner from "../_common/Spinner";
import UserAvatar from "../_common/UserAvatar";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarConversation } from "./SidebarConversation";

export function MessageConversation({
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
    .join(", ");

  const { data: session } = useSession();

  const { mutateAsync: setMessageToReadMutate } =
    api.messages.setMessageToRead.useMutation();

  const { updateUser } = useUpdateUser();

  const setConversationReadState = useConversation(
    (state) => state.setConversationReadState,
  );

  async function handleSelected() {
    if (session?.user.id !== messages[0]?.userId && messages[0]?.id) {
      void setMessageToReadMutate({ messageId: messages[0]?.id });
      if (session) {
        await updateUser({ lastTextAt: subHours(new Date(), 2) });
      }
    }
    // Update local state to true
    setConversationReadState(conversation.id);

    setSelected(conversation);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-start px-4 py-6 hover:cursor-pointer hover:bg-zinc-200",
        isSelected && "bg-zinc-100",
      )}
      onClick={() => handleSelected()}
    >
      <UserAvatar
        email={participants[0]?.email ?? ""}
        image={participants[0]?.image ?? ""}
        name={participants[0]?.name ?? ""}
      />

      <div className="ml-4 md:ml-2">
        <h1 className="font-bold">{displayParticipants}</h1>
        <p>{name}</p>
        <div className="line-clamp-1 flex flex-row items-center gap-1 text-sm text-muted-foreground">
          {messages.length > 0 &&
            !messages[0]?.read &&
            messages[0]?.userId !== session?.user.id && (
              <p className="rounded-full bg-blue-500 p-1" />
            )}
          {messages[0]?.userId === session?.user.id && "You: "}
          {messages[0]?.message ?? ""}
        </div>
        {session?.user.role === "admin" && (
          <p className="line-clamp-1 text-sm uppercase text-muted-foreground">
            Conversation Id: {id}
          </p>
        )}
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
  // Fetch only once on mount
  const { data: fetchedConversations, isLoading } =
    api.messages.getConversations.useQuery(undefined, {
      refetchOnWindowFocus: false,
      // refetchOnMount: false,
    });

  const conversations = useConversation((state) => state.conversationList);

  const setConversationList = useConversation(
    (state) => state.setConversationList,
  );

  useEffect(() => {
    // Check if data has been fetched and hasn't been processed yet
    if (fetchedConversations) {
      setConversationList(fetchedConversations);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedConversations]);

  const optimisticIds = useMessage((state) => state.optimisticIds);

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const { data: session } = useSession();

  // Map and listen to all the connects the user is part of
  useEffect(() => {
    const handlePostgresChange = async (payload: { new: MessageDbType }) => {
      setConversationToTop(payload.new.conversation_id, {
        id: payload.new.id,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id,
        message: payload.new.message,
        isEdit: payload.new.is_edit,
        createdAt: payload.new.created_at,
        read: payload.new.read,
      });
    };

    const fetchConversationIds = async () => {
      if (session) {
        const channels = conversations
          .map((conversation) => conversation.id)
          // When channel is selected turn of here so it can listen in the child
          .filter(
            (conversationId) => conversationId !== selectedConversation?.id,
          )
          .map((conversationId) =>
            supabase
              .channel(conversationId)
              .on(
                "postgres_changes",
                {
                  event: "INSERT",
                  schema: "public",
                  table: "messages",
                },
                (payload: { new: MessageDbType }) =>
                  void handlePostgresChange(payload),
              )
              .subscribe(),
          );

        return () => {
          channels.forEach((channel) => void channel.unsubscribe());
        };
      }
    };

    void fetchConversationIds();
  }, [
    conversations,
    optimisticIds,
    selectedConversation?.id,
    session,
    setConversationToTop,
  ]);

  return (
    <div>
      <div className="flex h-[73px] items-center border-b p-4">
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      <ScrollArea className="h-full p-2">
        {!isLoading ? (
          conversations.length > 0 ? (
            conversations.map((conversation) => (
              <SidebarConversation
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
                setSelected={setSelected}
              />
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center">
              <MessageEmptySvg />
              <h2 className="text-2xl font-bold">No conversations yet</h2>
              <p className="max-w-[300px] text-center text-muted-foreground">
                Messages from your conversations will show up here.
              </p>
            </div>
          )
        ) : (
          <div className="grid place-items-center text-muted-foreground">
            <Spinner />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
