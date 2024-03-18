import { type User, type MessageType } from "@/server/db/schema";
import { type ChatMessageType } from "@/utils/store/messages";

export type MessageGroup = {
  user: Pick<User, "name" | "email" | "image" | "id">;
  messages: MessageType[];
};

// groups messages made by the same user with <2 mins in between

export function groupMessages(
  messages: {
    message: ChatMessageType;
    user: MessageGroup["user"];
  }[],
) {
  const groups: MessageGroup[] = [];

  messages.forEach(({ message, user }) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && user.id !== lastGroup.user.id) {
      groups.push({
        user: user,
        messages: [message],
      });
    } else {
      const lastMessage = lastGroup?.messages[lastGroup.messages.length - 1];
      if (
        lastMessage &&
        message.createdAt.getTime() - lastMessage.createdAt.getTime() <= 120000
      ) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          user: user,
          messages: [message],
        });
      }
    }
  });

  return groups;
}
