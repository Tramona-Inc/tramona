import { type ChatMessageType } from "@/utils/store/messages";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";

export type MessageProp = {
  message: ChatMessageType;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
};

export function Message({ message, user }: MessageProp) {
  const { data: session } = useSession();

  return (
    <div className="flex items-start gap-3 p-5">
      <UserAvatar
        email={user.email ?? ""}
        image={user.image ?? ""}
        name={user.name ?? ""}
        size="lg"
      />

      <div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold">{user.name}</p>
          <p className="text-sm text-muted-foreground">
            {format(message.createdAt, "M/dd h:mm aaaa")}
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
