import { type ChatMessageType } from "@/utils/store/messages";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
export type MessageProp = {
  message: ChatMessageType;
};

function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000,
  );

  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}

export function Message({ message }: MessageProp) {
  const messageDate = convertUTCDateToLocalDate(new Date(message.createdAt));

  const { data: session } = useSession();

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
          <p className="text-sm text-muted-foreground">
            {dayjs(messageDate).format("M/DD h:mm a ")}
          </p>
          {session?.user.id === message.userId && message.read && (
            <p className="text-sm text-muted-foreground">read</p>
          )}
        </div>

        <p className="mt-2">{message.message}</p>
      </div>
    </div>
  );
}
