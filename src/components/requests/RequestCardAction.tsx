import { type DetailedRequest } from "@/server/api/routers/requestsRouter";
import { getRequestStatus } from "@/utils/formatters";
import { cn, plural } from "@/utils/utils";
import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";

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
