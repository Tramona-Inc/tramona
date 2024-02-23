import supabase from "@/utils/supabase-client";
import { useEffect } from "react";

type ListMessageProps = {
  conversationId: number;
};

function NoMessages() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      No messages
    </div>
  );
}

export default function ListMessages(props: ListMessageProps) {
  // const [messages, setMessages] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel(`${props.conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log("Change recieved!", payload);
        },
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
  });

  return (
    <div className="absolute h-full w-full space-y-5 p-5">
      {/* {messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      ) : (
        <NoMessages />
      )} */}
    </div>
  );
}
