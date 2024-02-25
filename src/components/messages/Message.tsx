// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
import { type ChatMessageType } from "@/utils/store/messages";
import UserAvatar from "../_common/UserAvatar";
export type MessageProp = {
  message: ChatMessageType;
};

// Plugin for relative time
// dayjs.extend(relativeTime);

export function Message({ message }: MessageProp) {
  // const daysDifference = dayjs().diff(dayjs(message.createdAt), "day");

  return (
    <div className="flex items-start gap-3 p-5">
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
