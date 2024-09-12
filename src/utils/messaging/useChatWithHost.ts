import { useRouter } from "next/router";
import { api } from "@/utils/api";

export function useChatWithHost() {
  const router = useRouter();

  const { mutateAsync: useChatWithHost } =
    api.messages.createConversationWithHost.useMutation({
      onSuccess: (conversationId) =>
        void router.push(`/messages?conversationId=${conversationId}`),
    });

  return useChatWithHost;
}
