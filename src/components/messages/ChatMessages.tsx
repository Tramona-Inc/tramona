import { useMessage } from "@/utils/store/messages";
import { useEffect } from "react";
import ListMessages from "./ListMessages";

export const LIMIT_MESSAGE = 20;

export default function ChatMessages({
  conversationId,
}: {
  conversationId: string;
}) {
  const { switchConversation, fetchInitialMessages } = useMessage();

  // Fetch conversation on the client
  useEffect(() => {
    console.log(
      "ChatMessages: Fetching messages for conversation:",
      conversationId,
    );

    // Update conversation state
    switchConversation(conversationId);

    // Fetch initial messages when the component mounts
    void fetchInitialMessages(conversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  return (
    <>
      <ListMessages />
    </>
  );
}
