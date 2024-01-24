import { cn, plural } from "@/utils/utils";
import { getRequestStatus, type RequestWithDetails } from "./utils";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";

export function RequestCardAction({
  request,
}: {
  request: RequestWithDetails;
}) {
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
        <Link href={`/requests/${request.id}`} className={primaryBtn}>
          View {plural(request.numOffers, "offer")} &rarr;
        </Link>
      );
    case "rejected":
      return <Button className={secondaryBtn}>Revise</Button>;
    case "booked":
      return <Button className={primaryBtn}>Request again</Button>;
  }
}
