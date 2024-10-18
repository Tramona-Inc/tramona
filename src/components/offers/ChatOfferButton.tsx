import { Button } from "@/components/ui/button";
import { MessageCirclePlusIcon } from "lucide-react";
import { useChatWithOffer } from "@/utils/messaging/useChatWithOffer";
interface ChatOfferButtonProps {
  offerId: string;
  offerHostId: string | null;
  offerPropertyName: string;
}

export default function ChatOfferButton({
  offerId,
  offerHostId,
  offerPropertyName,
}: ChatOfferButtonProps) {
  const chatWithOffer = useChatWithOffer();
  return (
    <Button
      className="bg-primaryGreen text-white"
      variant="secondary"
      onClick={() =>
        chatWithOffer({
          offerId,
          offerHostId: offerHostId ?? null,
          offerPropertyName,
        })
      }
    >
      <MessageCirclePlusIcon />
      {offerHostId ? "Send message to host" : "Send message"}
    </Button>
  );
}
