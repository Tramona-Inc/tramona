import { Button } from "@/components/ui/button";
import { MessageCirclePlusIcon } from "lucide-react";
import { useChatWithHostTeam } from "@/utils/messaging/useChatWithHost";
interface ChatOfferButtonProps {
  offerHostId: string | null;
  hostTeamId: number;
  propertyId: string;
}

export default function ChatOfferButton({
  offerHostId,
  hostTeamId,
  propertyId,
}: ChatOfferButtonProps) {
  const chatWithHost = useChatWithHostTeam();
  return (
    <Button
      variant="secondary"
      onClick={() =>
        chatWithHost({
          hostTeamId: hostTeamId,
          hostId: offerHostId!,
          propertyId: propertyId,
        })
      }
    >
      <MessageCirclePlusIcon />
      {offerHostId ? "Send message to host" : "Send message"}
    </Button>
  );
}
