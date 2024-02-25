import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import { useEffect, useRef } from "react";

export default function InitMessages({
  messages,
  conversationId,
}: {
  conversationId: number;
  messages: ChatMessageType[];
}) {
  const initState = useRef(false);

  const setInitConversationMessages = useMessage(
    (state) => state.setInitConversationMessages,
  );

  useEffect(() => {
    if (!initState.current) {
      console.log(messages);

      useMessage.setState((state) => ({
        conversations: {
          ...state.conversations,
          [conversationId]: messages,
        },
      }));

      initState.current = true;
    }
  }, []);

  return <></>;
}
