import { type MessageType } from "@/server/db/schema";
import supabase from "@/utils/supabase-client";
import { useEffect, useState } from "react";
import InitMessages from "./InitMessages";

type ChatMessagesProps = {
  conversationId: number;
};

export default function ChatMessages({ conversationId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<MessageType[]>();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select()
          .eq("conversation_id", conversationId);

        console.log(data);

        if (data) {
          setMessages(data);
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
    <div className="relative flex flex-1 overflow-y-auto">
      {/* <ListMessages /> */}
      <InitMessages messages={messages ?? []} />
    </div>
  );
}
