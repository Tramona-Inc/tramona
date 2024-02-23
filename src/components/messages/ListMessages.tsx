import { useMessage } from "@/utils/store/messages";
import { Message } from "./Message";

function NoMessages() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      No messages
    </div>
  );
}

export default function ListMessages() {
  const { currentConversationId, conversations } = useMessage();

  const messages = currentConversationId
    ? conversations[currentConversationId] ?? []
    : [];

  // useEffect(() => {
  //   const channel = supabase
  //     .channel(`${conversationId}`)
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "messages" },
  //       (payload) => {
  //         console.log("Change recieved!", payload);
  //       },
  //     )
  //     .subscribe();

  //   return () => {
  //     void channel.unsubscribe();
  //   };
  // });

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
