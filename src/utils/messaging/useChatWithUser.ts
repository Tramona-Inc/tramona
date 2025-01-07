import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { type TRPCError } from "@trpc/server";

export function useChatWithUser() {
  const router = useRouter();

  const { mutateAsync: createConversation } =
    api.messages.createConversationHostWithUser.useMutation();

  const chatWithUser = async (userId: string) => {
    try {
      const conversation = await createConversation({ userId });
      void router.push(`/host/messages?conversationId=${conversation.id}`);
    } catch (error) {
      const tRPCError = error as TRPCError;
      console.error("Failed to create conversation:", tRPCError.message);
    }
  };

  return chatWithUser;
}
