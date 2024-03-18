import { type MessageType } from "@/server/db/schema";
import { type ChatMessageType } from "@/utils/store/messages";

export type MessageGroup = {
  user: ChatMessageType["user"];
  messages: MessageType[];
};

// groups messages made by the same user with <2 mins in between

export function groupMessages(messages: ChatMessageType[]) {
  const groups: MessageGroup[] = [];

  messages.forEach((message) => {
    const lastGroup = groups[groups.length - 1];

    if (!lastGroup || message.user.email !== lastGroup.user.email) {
      groups.push({
        user: message.user,
        messages: [message],
      });
    } else {
      const lastMessage = lastGroup.messages[lastGroup.messages.length - 1];
      if (
        lastMessage &&
        message.createdAt.getTime() - lastMessage.createdAt.getTime() <= 120000
      ) {
        lastGroup.messages.push(message);
      } else {
        groups.push({
          user: message.user,
          messages: [message],
        });
      }
    }
  });

  return groups;
}
