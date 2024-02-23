import UserAvatar from "../_common/UserAvatar";
import { type ChatMessageResult } from "./ChatMessages";

export type MessageProp = {
  message: ChatMessageResult;
};

export function Message({ message }: MessageProp) {
  return (
    <div className="flex items-start gap-3">
      <UserAvatar
        email={undefined}
        image={message.user.image}
        name={message.user.name}
        size="lg"
      />

      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{message.user.name}</p>
          {/* <p className="text-sm text-muted-foreground">{date}</p> */}
        </div>

        <p className="mt-2">{message.message}</p>
      </div>
    </div>
  );
}
