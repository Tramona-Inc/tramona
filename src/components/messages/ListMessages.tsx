import UserAvatar from "../_common/UserAvatar";

export type MessageProp = {
  id: string;
  sender: { id: string; name: string; recentMessage: string };
  createdAt: string;
  content: string;
};

export function Message() {
  const message: MessageProp = {
    id: "1",
    createdAt: "3:20 pm",
    sender: { id: "1", name: "Anna", recentMessage: "" },
    content:
      "Hey there! I'm very much looking forward to having you!!!! I'll send check-in instructions at check-in at 2PM the day of your stay (it is self check in anytime after 2PM). Don't worry - it's automatic, so you will get the message at that time. If you have any questions in the meantime, just let me know! I'm easy to reach and happy to help! ***Please note we have a ZERO TOLERANCE for parties or unregistered guests and too many cars - this will result in police escort removal and reservation cancellation, and have a strict no pets policy.***",
  };

  return (
    <div className="flex items-start gap-3">
      <UserAvatar
        email={undefined}
        image={undefined}
        name={message.sender.name}
        size="lg"
      />

      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{message.sender.name}</p>
          <p className="text-sm text-muted-foreground">{message.createdAt}</p>
        </div>

        <p className="mt-2">{message.content}</p>
      </div>
    </div>
  );
}

export default function ListMessages() {
  return (
    <div className="absolute space-y-5 p-5">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
        <Message key={value} />
      ))}
    </div>
  );
}
