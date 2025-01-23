import { useRouter } from "next/router";
import { api } from "@/utils/api";

export function useChatWithHostTeam() {
  const router = useRouter();

  const { mutateAsync: useChatWithHostTeam } =
    api.messages.createConversationWithHostOrAdminTeam.useMutation({
      onSuccess: (conversationId) => {
        void router.push(`/messages/${conversationId}`);
      },
    });

  return useChatWithHostTeam;
}
