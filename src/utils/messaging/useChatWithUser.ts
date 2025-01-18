import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { type TRPCError } from "@trpc/server";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
export function useChatWithUser() {
  const router = useRouter();
  const { currentHostTeamId } = useHostTeamStore();

  const { mutateAsync: createConversation } =
    api.messages.createConversationHostWithUser.useMutation();

  const chatWithUser = async (userId: string) => {
    try {
      const conversation = await createConversation({
        userId,
        currentHostTeamId: currentHostTeamId!,
      });

      if (!conversation.id) {
        throw new Error("Failed to create conversation");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      await router.push(`/host/messages?conversationId=${conversation.id}`);
    } catch (error) {
      const tRPCError = error as TRPCError;
      console.error("Failed to create conversation:", tRPCError.message);
    }
  };

  return chatWithUser;
}
