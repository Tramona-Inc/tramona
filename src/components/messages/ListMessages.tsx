import { type MessageDbType } from "@/types/supabase.message";
import { ChatMessageType, useMessage } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { useEffect } from "react";
import { Message } from "./Message";

function NoMessages() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      No messages
    </div>
  );
}

export default function ListMessages() {
  const conversations = useMessage((state) => state.conversations);
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

  // console.log(messages);

  console.log(conversations);

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    // console.log("Change received!", payload);

    if (!optimisticIds.includes(payload.new.id)) {
      // Get user associated with message
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
        addMessageToConversation(currentConversationId!, newMessage);
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
  }, [currentConversationId, messages, conversations, handlePostgresChange]);

  return (
    <div className="absolute h-full w-full space-y-5 p-5">
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      ) : (
        <NoMessages />
      )}
    </div>
  );
}
