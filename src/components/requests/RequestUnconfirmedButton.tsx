import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { toast } from "../ui/use-toast";

export function RequestUnconfirmedButton({
  requestGroupId,
  isWaiting,
  onClick,
}: {
  requestGroupId: number;
  isWaiting: boolean;
  onClick: () => void;
}) {
  const [isSending, setIsSending] = useState(isWaiting);

  const { mutateAsync: resendConfirmation } =
    api.requests.updateConfirmation.useMutation();

  useEffect(() => {
    if (!isWaiting) {
      setIsSending(isWaiting);
    }
  }, [isWaiting]);

  const handleClick = async () => {
    setIsSending(true);
    await resendConfirmation({ requestGroupId });
    toast({
      title: "Successfully resent confirmation text",
      description: "Please check your messages",
    });
    onClick();
  };

  return (
    <Button
      className="rounded-md pr-3"
      variant="secondary"
      onClick={handleClick}
      disabled={isSending || isWaiting}
    >
      {isSending ? "Awaiting Confirmation" : "Resend Confirmation"}
    </Button>
  );
}
