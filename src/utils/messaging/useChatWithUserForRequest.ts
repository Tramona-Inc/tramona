//Same thing as useChatWithUser but for requests, since requests are associated with multiple properties, there needs to be a different way to set it up
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { type TRPCError } from "@trpc/server";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
export function useChatWithUserForRequest() {
  const router = useRouter();
  const { currentHostTeamId } = useHostTeamStore();

  const { mutateAsync: createConversation } =
    api.messages.createConversationHostWithUserForRequest.useMutation();

  const chatWithUserForRequest = async (userId: string, requestId: number) => {
    try {
      const conversation = await createConversation({
        userId,
        currentHostTeamId: currentHostTeamId!,
        requestId: requestId,
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

  return chatWithUserForRequest;
}
