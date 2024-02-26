import { getRequestStatus } from "@/utils/formatters";
import { cn, plural } from "@/utils/utils";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { type DetailedRequest } from "./RequestCard";

export function RequestCardAction({ request }: { request: DetailedRequest }) {
  const primaryBtn = cn(buttonVariants(), "rounded-full");
  const secondaryBtn = cn(
    buttonVariants({ variant: "outline" }),
    "rounded-full",
  );

  switch (getRequestStatus(request)) {
    case "pending":
      return null;
    case "accepted":
      return (
        <Link
          href={`/requests/${request.id}`}
          className={cn(primaryBtn, "pr-3")}
        >
          View {plural(request.numOffers, "offer")}
          <ArrowRightIcon />
        </Link>
      );
    case "rejected":
      return <Button className={secondaryBtn}>Revise</Button>;
    case "booked":
      return <Button className={primaryBtn}>Request again</Button>;
  }
}
