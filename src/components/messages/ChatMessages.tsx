import { type MessageType } from "@/server/db/schema";
import supabase from "@/utils/supabase-client";
import { useEffect, useState } from "react";
import InitMessages from "./InitMessages";

type ChatMessagesProps = {
  conversationId: number;
};

export type ChatMessageResult = MessageType & {
  user: { name: string | null; email: string; image: string };
};

export default function ChatMessages({ conversationId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<ChatMessageResult[]>();

  useEffect(() => {
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
          .eq("conversation_id", conversationId);

        if (data) {
          // TODO: FIX this is weird
          const chatMessages: ChatMessageResult[] =
            data as unknown as ChatMessageResult[];
          setMessages(chatMessages);
        }

        console.log(data);

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
    <div className="relative flex flex-1 overflow-y-auto">
      {/* <ListMessages /> */}
      <InitMessages messages={messages ?? []} />
    </div>
  );
}
