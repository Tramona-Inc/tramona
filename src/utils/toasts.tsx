import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { formatCurrency, formatDateRange, getNumNights } from "./utils";
import { type Request } from "@/server/db/schema";

export function errorToast(error = "Something went wrong, please try again") {
  toast({
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
  request: Pick<Request, "location" | "checkIn" | "checkOut" | "maxTotalPrice">,
) {
  const numNights = getNumNights(request.checkIn, request.checkOut);
  const fmtdNightlyPrice = formatCurrency(request.maxTotalPrice / numNights);
  const fmtdDateRange = formatDateRange(request.checkIn, request.checkOut);

  toast({
    title: `Request sent successfully!`,
    description: `${request.location} for ${fmtdNightlyPrice} · ${fmtdDateRange}`,
  });
}

export function successfulAdminOfferToast({
  propertyName,
  totalBasePriceBeforeFees,
  checkIn,
  checkOut,
  isUpdate = false,
}: {
  propertyName: string;
  totalBasePriceBeforeFees: number;
  checkIn: Date;
  checkOut: Date;
  isUpdate?: boolean;
}) {
  const pricePerNight =
    totalBasePriceBeforeFees / getNumNights(checkIn, checkOut);

  const fmtdTotalPrice = `${formatCurrency(totalBasePriceBeforeFees)} total`;
  const fmtdNightlyPrice = `${formatCurrency(pricePerNight)}/night`;
  const fmtdDateRange = formatDateRange(checkIn, checkOut);

  toast({
    title: `Offer ${isUpdate ? "updated" : "sent"}: ${propertyName}`,
    description: `${fmtdTotalPrice} · ${fmtdNightlyPrice} · ${fmtdDateRange}`,
  });
}
