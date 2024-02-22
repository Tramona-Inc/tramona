import { type MessageType } from "@/server/db/schema";
import { Message } from "./Message";

type InitMessageProps = {
  messages: MessageType[];
};

export default function InitMessages(props: InitMessageProps) {
  const { messages } = props;

  return (
    <div className="absolute h-full w-full space-y-5 p-5">
      {messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
          No messages
        </div>
      )}
    </div>
  );
}
