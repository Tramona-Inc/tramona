import { LIMIT_MESSAGE } from "@/components/messages/ChatMessages";
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

  const hasMore = messages.length >= LIMIT_MESSAGE;

  useEffect(() => {
    if (!initState.current) {
      useMessage.setState((state) => ({
        conversations: {
          ...state.conversations,
          [conversationId]: {
            messages,
            page: 0,
            hasMore: hasMore,
          },
        },
      }));

      initState.current = true;
    }
  }, []);

  return <></>;
}
