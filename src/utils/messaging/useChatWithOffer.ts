import { api } from "@/utils/api";
import { useRouter } from "next/router";

//will create chat with admin if host does not exist
export function useChatWithOffer() {
  const router = useRouter();
  const { mutateAsync: useChatWithOffer } =
    api.messages.createOrFetchConversationWithOffer.useMutation({
      onSuccess: (conversationId) => {
        void router.push(`/messages?conversationId=${conversationId}`);
      },
    });

  return useChatWithOffer;
}
