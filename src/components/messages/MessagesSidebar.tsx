import { type MessageDbType } from "@/types/supabase.message";
import { api } from "@/utils/api";
import {
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";
import { cn } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Spinner from "../_common/Spinner";
import UserAvatar from "../_common/UserAvatar";

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

  const { mutateAsync: setMessageToReadMutate } =
    api.messages.setMessageToRead.useMutation();

  const setConversationReadState = useConversation(
    (state) => state.setConversationReadState,
  );

  function handleSelected() {
    if (session?.user.id !== messages[0]?.userId && messages[0]?.id) {
      void setMessageToReadMutate({ messageId: messages[0]?.id });
    }
    // Update local state to true
    setConversationReadState(conversation.id);

    setSelected(conversation);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-start border-b px-4 py-6 hover:cursor-pointer hover:bg-zinc-200 lg:p-8",
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
        <p className="line-clamp-1 flex flex-row items-center gap-1 text-sm text-muted-foreground">
          {messages.length > 0 &&
            !messages[0]?.read &&
            messages[0]?.userId !== session?.user.id && (
              <span className="rounded-full bg-blue-500 p-1" />
            )}
          {messages[0]?.userId === session?.user.id && "You: "}
          {messages[0]?.message ?? ""}
        </p>
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
  // Will only run once on mount
  const { data: fetchedConversations, isLoading } =
    api.messages.getConversations.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
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
  }, [fetchedConversations, setConversationList]);

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    const { data, error } = await supabase
      .from("user")
      .select("name, email, image")
      .eq("id", payload.new.user_id)
      .single();

    if (error) {
      errorToast(error.message);
    } else {
      const newMessage: ChatMessageType = {
        id: payload.new.id,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id,
        message: payload.new.message,
        isEdit: payload.new.is_edit,
        createdAt: new Date(payload.new.created_at),
        read: payload.new.read,
        user: data,
      };

      setConversationToTop(payload.new.conversation_id, newMessage);
    }
  };
  const { data: session } = useSession();

  useEffect(() => {
    const fetchConversationIds = async () => {
      if (session) {
        const { data: conversationIds, error } = await supabase
          .from("conversation_participants")
          .select("conversation_id")
          .eq("user_id", session.user.id);

        if (error) {
          errorToast(error.message);
        } else {
          // Subscribe to only the channels user is part of
          const channels = conversationIds.map((conversationId) =>
            supabase
              .channel(conversationId.conversation_id)
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
      }
    };

    void fetchConversationIds();
  }, []);

  return (
    <div className="w-96 border-r">
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
          <div className="grid h-full place-items-center text-muted-foreground">
            <p>No conversations yet</p>
          </div>
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
}
