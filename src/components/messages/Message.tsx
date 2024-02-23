// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
import UserAvatar from "../_common/UserAvatar";
import { type ChatMessageResult } from "./ChatMessages";

export type MessageProp = {
  message: ChatMessageResult;
};

// Plugin for relative time
// dayjs.extend(relativeTime);

export function Message({ message }: MessageProp) {
  // const daysDifference = dayjs().diff(dayjs(message.createdAt), "day");

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
          {/* <p className="text-sm text-muted-foreground">
            {dayjs(message.createdAt).fromNow()}
          </p> */}
        </div>

        <p className="mt-2">{message.message}</p>
      </div>
    </div>
  );
}
