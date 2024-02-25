import { type MessageDbType } from "@/types/supabase.message";
import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { useEffect, useRef } from "react";
import { Message } from "./Message";

function NoMessages() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      No messages
    </div>
  );
}

export default function ListMessages() {
  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  const { conversations } = useMessage();
  const optimisticIds = useMessage((state) => state.optimisticIds);
  const currentConversationId = useMessage(
    (state) => state.currentConversationId,
  );

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );

  const messages = currentConversationId
    ? conversations[currentConversationId] ?? []
    : [];

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    if (!optimisticIds.includes(payload.new.id)) {
      const { data, error } = await supabase
        .from("user")
        .select("name, email, image")
        .eq("id", payload.new.user_id)
        .single();
      if (error) {
        console.log(error);
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
        addMessageToConversation(payload.new.conversation_id, newMessage);
      }
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel(`${currentConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        handlePostgresChange,
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  }, [currentConversationId, messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="relative mb-2 flex flex-1 flex-col overflow-y-auto"
    >
      <div className="flex-1"></div>
      <div className="absolute w-full space-y-10 p-5">
        {messages.length > 0 ? (
          messages
            .slice()
            .reverse()
            .map((message) => <Message key={message.id} message={message} />)
        ) : (
          <NoMessages />
        )}
      </div>
    </div>
  );
}
