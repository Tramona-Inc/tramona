import React, { useState, useEffect, MouseEventHandler } from "react";
import { Button } from "../ui/button";
import { api } from "@/utils/api";
import { type DetailedRequest } from "./RequestCard";
import { useInterval } from "@/utils/useInterval";

type ClickHandler = () => void;

type RequestUnconfirmedButtonProps = {
  request: DetailedRequest;
  isWaiting: boolean | undefined;
  onClick: ClickHandler;
};

export function RequestUnconfirmedButton({ request, isWaiting, onClick }: RequestUnconfirmedButtonProps) {

  const [isSending, setIsSending] = useState(isWaiting);

  const confirmationMutation = api.requests.updateConfirmation.useMutation();
  const number = request.madeByUser.phoneNumber;

  useEffect(() => {
    if (!isWaiting) {
      setIsSending(isWaiting);
    }
  }, [isWaiting])



  const handleClick = async () => {
    if (number !== null) {
      setIsSending(true)
      await confirmationMutation.mutateAsync({requestId: request.id, phoneNumber: number});
      onClick();
    }
  };



  return (
    <Button className="rounded-full pr-3" onClick={handleClick} disabled={isSending}>
      {isSending ? "Awaiting Confirmation" :  "Resend Confirmation"}
    </Button>
  )
};