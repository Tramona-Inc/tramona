import { getRequestStatus } from "@/utils/formatters";
import { plural } from "@/utils/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon, UserPlusIcon } from "lucide-react";
import { type DetailedRequest } from "./RequestCard";
import GroupDetailsDialog from "./group-details-dialog/GroupDetailsDialog";

export function RequestCardAction({ request }: { request: DetailedRequest }) {
  switch (getRequestStatus(request)) {
    case "pending":
      return request.groupMembers.length < request.numGuests ? (
        <GroupDetailsDialog request={request}>
          <Button className="rounded-full">
            <UserPlusIcon />
            Invite people
          </Button>
        </GroupDetailsDialog>
      ) : null;
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
  }
}
