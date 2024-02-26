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

  useEffect(() => {
    if (!initState.current) {
      useMessage.setState((state) => ({
        conversations: {
          ...state.conversations,
          [conversationId]: {
            messages,
            page: 0,
          },
        },
      }));

      initState.current = true;
    }
  }, []);

  return <></>;
}
