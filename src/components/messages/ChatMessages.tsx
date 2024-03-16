import { useMessage } from "@/utils/store/messages";
import { useEffect } from "react";
import ListMessages from "./ListMessages";

export const LIMIT_MESSAGE = 9;

export default function ChatMessages({
  conversationId,
}: {
  conversationId: number;
}) {
  const { switchConversation, fetchInitialMessages } = useMessage();

  // Fetch conversation on the client
  useEffect(() => {
    // Update conversation state
    switchConversation(conversationId);

    console.log("CALLED");
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
