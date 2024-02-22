import { type MessageType } from "@/server/db/schema";
import { Message } from "./Message";

type InitMessageProps = {
  messages: MessageType[];
};

export default function InitMessages(props: InitMessageProps) {
  const { messages } = props;

  return (
    <div className="absolute space-y-5 p-5">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
