import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { type DetailedRequest } from "./RequestCard";
import { toast } from "../ui/use-toast";

export function RequestUnconfirmedButton({
  request,
  isWaiting,
  onClick,
}: {
  request: DetailedRequest;
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
    await resendConfirmation({ requestId: request.id });
    toast({
      title: "Successfully resent confirmation text",
      description: "Please check your messages",
    });
    onClick();
  };

  return (
    <Button
      className="rounded-full pr-3"
      onClick={handleClick}
      disabled={isSending || isWaiting}
    >
      {isSending ? "Awaiting Confirmation" : "Resend Confirmation"}
    </Button>
  );
}
