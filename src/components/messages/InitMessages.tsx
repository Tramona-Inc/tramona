import { Message } from "./Message";

type InitMessageProps = {
  messages: number[];
};

export default function InitMessages(props: InitMessageProps) {
  const { messages } = props;

  return (
    <div className="absolute space-y-5 p-5">
      {messages.map((value) => (
        <Message key={value} />
      ))}
    </div>
  );
}
