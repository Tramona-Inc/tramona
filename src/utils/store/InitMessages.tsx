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

  const { setInitConversationMessages } = useMessage();

  useEffect(() => {
    if (!initState.current) {
      setInitConversationMessages(conversationId, messages);
      initState.current = true;
    }
  }, [conversationId, messages, setInitConversationMessages]);

  return <></>;
}
