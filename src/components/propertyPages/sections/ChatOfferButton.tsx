import { Button } from "@/components/ui/button";
import { MessageCirclePlusIcon } from "lucide-react";
import { useChatWithHost } from "@/utils/messaging/useChatWithHost";
interface ChatOfferButtonProps {
  offerHostId: string | null;
  offerPropertyName: string;
  hostTeamId: number;
}

export default function ChatOfferButton({
  offerHostId,
  offerPropertyName,
  hostTeamId,
}: ChatOfferButtonProps) {
  const chatWithHost = useChatWithHost();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        chatWithHost({
          hostTeamId: hostTeamId,
          hostId: offerHostId!,
        })
      }
    >
      <MessageCirclePlusIcon />
      {offerHostId ? "Send message to host" : "Send message"}
    </Button>
  );
}
