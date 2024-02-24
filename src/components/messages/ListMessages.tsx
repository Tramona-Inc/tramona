import { SupabaseDatabase } from "@/types/supabase";
import { ChatMessageType, useMessage } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { useEffect } from "react";
import { Message } from "./Message";

export type MessageDbType =
  SupabaseDatabase["public"]["Tables"]["messages"]["Row"];

function NoMessages() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      No messages
    </div>
  );
}

export default function ListMessages() {
  const {
    currentConversationId,
    conversations,
    optimisticIds,
    addMessageToConversation,
  } = useMessage((state) => state);

  const messages = currentConversationId
    ? conversations[currentConversationId] ?? []
    : [];

  console.log(messages);

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    console.log("Change received!", payload);

    try {
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

          addMessageToConversation(
            currentConversationId!,
            newMessage,
            optimisticIds,
          );
        }
      }
    } catch (error) {
      console.error(error);
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
  }, [currentConversationId, addMessageToConversation, messages]);

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
