import { useRouter } from "next/router";
import { api } from "../api";

export function useChatWithAdmin() {
  const router = useRouter();

  const { mutateAsync: chatWithAdmin } =
    api.messages.createConversationWithAdmin.useMutation({
      onSuccess: (conversationId) => {
        void router.push(`/messages?conversationId=${conversationId}`);
      },
    });

  return chatWithAdmin;
}
