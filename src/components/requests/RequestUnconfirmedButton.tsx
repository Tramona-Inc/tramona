import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { type DetailedRequest } from "./RequestCard";

export function RequestUnconfirmedButton({
  request,
  isWaiting = false,
  onClick,
}: {
  request: DetailedRequest;
  isWaiting?: boolean;
  onClick: () => void;
}) {
  const [isSending, setIsSending] = useState(isWaiting);

  const confirmationMutation = api.requests.updateConfirmation.useMutation();

  useEffect(() => {
    if (!isWaiting) {
      setIsSending(isWaiting);
    }
  }, [isWaiting]);

  const handleClick = async () => {
    setIsSending(true);
    await confirmationMutation.mutateAsync({
      requestId: request.id,
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
