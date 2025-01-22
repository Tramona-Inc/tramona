// components/messages/ChatMessages.tsx
import { useMessage } from "@/utils/store/messages";
import { useEffect } from "react";
import ListMessages from "./ListMessages";

export const LIMIT_MESSAGE = 20;

export default function ChatMessages({
  conversationId,
  onMessagesLoadStart, // Add callbacks as props
  onMessagesLoadEnd,
}: {
  conversationId: string;
  onMessagesLoadStart: () => void;
  onMessagesLoadEnd: () => void;
}) {
  const { switchConversation, fetchInitialMessages } = useMessage();

  useEffect(() => {
    console.log(
      "ChatMessages: Fetching messages for conversation:",
      conversationId,
    );

    onMessagesLoadStart(); // Indicate loading started

    switchConversation(conversationId);

    const loadMessages = async () => {
      await fetchInitialMessages(conversationId);
      onMessagesLoadEnd(); // Indicate loading ended
    };

    void loadMessages();

    return () => {
      onMessagesLoadEnd(); // Ensure loading state is cleared on unmount/re-render
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return (
    <>
      <ListMessages />
    </>
  );
}
