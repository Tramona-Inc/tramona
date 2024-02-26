import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";
import { getFromAndTo } from "@/utils/utils";
import { Button } from "../ui/button";
import { LIMIT_MESSAGE } from "./ChatMessages";

export default function LoadMoreMessages() {
  const currentConversationId = useMessage(
    (state) => state.currentConversationId,
  );

  const { conversations } = useMessage();
  const page = currentConversationId
    ? conversations[currentConversationId]?.page ?? 1
    : 1;

  const setMoreMessagesToConversation = useMessage(
    (state) => state.setMoreMessagesToConversation,
  );

  // Fetch conversation on the client
  const fetchConversation = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

    if (currentConversationId) {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          user(name, image, email)
        `,
        )
        .range(from, to)
        .eq("conversation_id", currentConversationId)
        .order("created_at", { ascending: false });

      if (error) {
        errorToast(error.message);
      } else {
        const loadedMessages: ChatMessageType[] = data.map((message) => ({
          conversationId: message.conversation_id,
          id: message.id,
          createdAt: new Date(message.created_at),
          userId: message.user_id,
          message: message.message,
          read: message.read,
          isEdit: message.is_edit,
          user: {
            name: message.user?.name ?? "",
            image: message.user?.image ?? "",
            email: message.user?.email ?? "",
          },
        }));

        setMoreMessagesToConversation(currentConversationId, loadedMessages);
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-5">
      <Button
        variant={"darkPrimary"}
        className="mx-10 w-full transition-all hover:scale-110"
        onClick={() => fetchConversation()}
      >
        Load More
      </Button>
    </div>
  );
}
