import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { formatCurrency, formatDateRange, getNumNights, plural } from "./utils";
import { Property, type Request } from "@/server/db/schema";

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

export function successfulAdminOfferToast({
  propertyName,
  totalPrice,
  checkIn,
  checkOut,
}: {
  propertyName: string;
  totalPrice: number;
  checkIn: Date;
  checkOut: Date;
}) {
  const pricePerNight = totalPrice / getNumNights(checkIn, checkOut);

  const fmtdTotalPrice = `${formatCurrency(totalPrice)} total`;
  const fmtdNightlyPrice = `${formatCurrency(pricePerNight)}/night`;
  const fmtdDateRange = formatDateRange(checkIn, checkOut);

  return toast({
    title: `Offer sent: ${propertyName}`,
    description: `${fmtdTotalPrice} • ${fmtdNightlyPrice} • ${fmtdDateRange}`,
  });
}
