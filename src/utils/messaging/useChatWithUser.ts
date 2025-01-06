import { useRouter } from "next/router";
import { api } from "@/utils/api";

export function useChatWithUser() {
  const router = useRouter();

  const { mutateAsync: useChatWithUser } =
    api.messages.createConversationHostWithUser.useMutation({
      onSuccess: (conversationId) =>
        void router.push(`/messages?conversationId=${conversationId}`),
    });

  return useChatWithUser;
}
