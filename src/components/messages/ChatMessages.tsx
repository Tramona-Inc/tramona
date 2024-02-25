import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { useEffect, useState } from "react";
import InitMessages from "../../utils/store/InitMessages";
import ListMessages from "./ListMessages";

const LIMIT_MESSAGE = 9;

export default function ChatMessages({
  conversationId,
}: {
  conversationId: number;
}) {
  const [messages, setMessages] = useState<ChatMessageType[]>();

  const { switchConversation, setInitConversationMessages } = useMessage();

  // Fetch conversation on the client
  useEffect(() => {
    // Update conversation state
    switchConversation(conversationId);

    const fetchConversation = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select(
            `
            *,
            user(name, image, email)
          `,
          )
          .range(0, LIMIT_MESSAGE)
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: false });

        if (data) {
          // TODO: FIX this is weird
          const chatMessages: ChatMessageType[] =
            data as unknown as ChatMessageType[];
          setMessages(chatMessages);
          setInitConversationMessages(conversationId, chatMessages);
        }
        if (error) {
          throw error;
        }
      } catch (error) {
        console.log(error);
      }
    };

    void fetchConversation();
  }, [conversationId]);

  return (
    <div className="relative flex-1 overflow-y-auto flex">
      {/* Display's our messages */}
      <ListMessages />

      {/* Initializes messages with zustand */}
      {messages && (
        <InitMessages messages={messages} conversationId={conversationId} />
      )}
    </div>
  );
}
