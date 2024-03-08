import { getRequestStatus } from "@/utils/formatters";
import { plural } from "@/utils/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { type DetailedRequest } from "./RequestCard";
import { RequestUnconfirmedButton } from "./RequestUnconfirmedButton";
import { MouseEventHandler, useState } from "react";
import { api } from "@/utils/api";
import { State } from "postgres";


type RequestCardActionProps = {
  request: DetailedRequest;
  isWaiting: boolean | undefined;
  onClick: () => void;
};

export function RequestCardAction({ request, isWaiting, onClick }: RequestCardActionProps) {
  switch (getRequestStatus(request)) {
    case "pending":
      return null;
    case "accepted":
      return (
        <Button asChild className="rounded-full pr-3">
          <Link href={`/requests/${request.id}`}>
            View {plural(request.numOffers, "offer")}
            <ArrowRightIcon />
          </Link>
        </Button>
      );
    case "rejected":
      // return <Button className={secondaryBtn}>Revise</Button>;
      return null;
    case "booked":
      // return <Button className={primaryBtn}>Request again</Button>;
      return null;
    case "unconfirmed":
      return (
        request.madeByUser.phoneNumber && <RequestUnconfirmedButton request={request} isWaiting={isWaiting} onClick={onClick} />
      );
  }
}
