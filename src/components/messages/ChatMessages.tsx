// components/messages/ChatMessages.tsx
import React, { useEffect } from "react"; // Make sure React and useEffect are imported
import ListMessages from "./ListMessages";
import { useMessage } from "@/utils/store/messages";
import { useConversation } from "@/utils/store/conversations";

export const LIMIT_MESSAGE = 20;

interface ChatMessagesProps {
  // Define an interface for props
  conversationId: string | undefined; // Allow undefined conversationId
  onMessagesLoadEnd: () => void; // **CRITICAL: Define onMessagesLoadEnd in props**
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  // Use React.FC and the interface
  conversationId,
  onMessagesLoadEnd, // **Destructure onMessagesLoadEnd from props**
}) => {
  const { switchConversation, fetchInitialMessages } = useMessage();
  const conversations = useConversation((state) => state.conversationList);

  useEffect(() => {
    if (!conversationId) return; // Add a check for undefined conversationId

    switchConversation(conversationId);
    void fetchInitialMessages(conversationId);
  }, [
    conversationId,
    conversations,
    onMessagesLoadEnd,
    switchConversation,
    fetchInitialMessages,
  ]); // Add onMessagesLoadEnd to dependencies

  return (
    <>
      <ListMessages />
    </>
  );
};

export default ChatMessages;
