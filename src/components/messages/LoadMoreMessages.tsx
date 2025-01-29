import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";
import { getFromAndTo } from "@/utils/utils";
import { Button } from "../ui/button";
import { LIMIT_MESSAGE } from "./ChatMessages";
import { ChevronUpIcon } from "lucide-react";

export default function LoadMoreMessages() {
  const currentConversationId = useMessage(
    (state) => state.currentConversationId,
  );

  const { conversations } = useMessage();
  const page = currentConversationId
    ? (conversations[currentConversationId]?.page ?? 1)
    : 1;

  const totalMessagesCount = currentConversationId
    ? (conversations[currentConversationId]?.messages.length ?? 0)
    : 0;

  const setMoreMessagesToConversation = useMessage(
    (state) => state.setMoreMessagesToConversation,
  );

  // Fetch conversation on the client
  const fetchConversation = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

    // Case for optimistic ui/ create the new offset
    // for the inital fetch convo with new optimistic ui
    let offset = 0;

    if (totalMessagesCount > 0) {
      offset = totalMessagesCount - page * LIMIT_MESSAGE;
    }

    if (offset < 0) {
      offset = 0;
    }

    if (currentConversationId) {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
        *,
        user(name, image, email)
      `,
        )
        .range(from + offset, to + offset)
        .eq("conversation_id", currentConversationId)
        .order("created_at", { ascending: false });

      if (error) {
        errorToast();
      } else {
        const loadedMessages: ChatMessageType[] = data.map((message) => ({
          conversationId: message.conversation_id,
          id: message.id,
          createdAt: message.created_at,
          userId: message.user_id,
          message: message.message,
          read: message.read,
          isEdit: message.is_edit,
          user: {
            name: message.user?.name ?? "",
            image: message.user.image,
            email: message.user.email,
          },
        }));

        setMoreMessagesToConversation(currentConversationId, loadedMessages);
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Button className="rounded-full pl-3" onClick={() => fetchConversation()}>
        <ChevronUpIcon /> Load More
      </Button>
    </div>
  );
}
