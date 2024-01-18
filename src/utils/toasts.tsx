import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { formatCurrency, formatDateRange, getNumNights, plural } from "./utils";
import { type Request } from "@/server/db/schema";

export function errorToast(error = "Something went wrong, please try again") {
  return toast({
    title: error,
    description: (
      <>
        Please{" "}
        <Link href="/support" className="underline underline-offset-2">
          contact support
        </Link>{" "}
        if the issue persists
      </>
    ),
    variant: "destructive",
  });
}

export function successfulRequestToast(
  request: Pick<
    Request,
    "checkIn" | "checkOut" | "maxTotalPrice" | "numGuests" | "location"
  >,
) {
  const pricePerNight =
    request.maxTotalPrice / getNumNights(request.checkIn, request.checkOut);
  const fmtdPrice = `${formatCurrency(pricePerNight)}/night`;
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);
  const fmtdNumGuests = plural(request.numGuests, "guest");

  return toast({
    title: `Request sent: ${request.location}`,
    description: `${fmtdPrice} • ${fmtdDateRange} • ${fmtdNumGuests}`,
  });
}
