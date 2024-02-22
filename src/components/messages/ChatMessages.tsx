import { type MessageType } from "@/server/db/schema";
import supabase from "@/utils/supabase-client";
import { useEffect, useState } from "react";
import InitMessages from "./InitMessages";

export default function ChatMessages() {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [messages, setMessages] = useState<MessageType[]>();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select()
          .eq("conversation_id", 1);

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
  }, []);

  return (
    <div className="relative flex flex-1 overflow-y-auto">
      {/* <ListMessages /> */}
      <InitMessages messages={messages ?? []} />
    </div>
  );
}
