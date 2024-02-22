import { type MessageType } from "@/server/db/schema";
import UserAvatar from "../_common/UserAvatar";

export type MessageProp = {
  message: MessageType;
};

export function Message({ message }: MessageProp) {
  return (
    <div className="flex items-start gap-3">
      <UserAvatar
        email={undefined}
        image={undefined}
        name={undefined}
        size="lg"
      />

      <div>
        <div className="flex items-baseline gap-2">
          {/* <p className="text-2xl font-bold">{message.sender.name}</p> */}
          {/* <p className="text-sm text-muted-foreground">
            {message.createdAt as string}
          </p> */}
        </div>

        <p className="mt-2">{message.message}</p>
      </div>
    </div>
  );
}
