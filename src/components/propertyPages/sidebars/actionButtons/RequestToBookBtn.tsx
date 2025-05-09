import IdentityModal from "@/components/_utils/IdentityModal";
import { VerificationProvider } from "@/components/_utils/VerificationContext";
import { Button, ButtonProps } from "@/components/ui/button";
import { RouterOutputs } from "@/utils/api";
import { api } from "@/utils/api";
import { formatDateMonthDayYear } from "@/utils/utils";
import Link from "next/link";
import { useMemo } from "react";

export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];
export type PropertyPageData = RouterOutputs["properties"]["getById"];

export type RequestToBookDetails = {
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
};

export default function RequestToBookBtn({
  btnSize,
  requestToBook,
  property,
  requestPercentage,
  invalidInput = false,
}: {
  btnSize: ButtonProps["size"];
  requestToBook: RequestToBookDetails;
  property: PropertyPageData;
  requestPercentage: number;
  invalidInput?: boolean;
}) {
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  const checkoutUrl = useMemo(() => {
    const checkIn = formatDateMonthDayYear(requestToBook.checkIn);
    const checkOut = formatDateMonthDayYear(requestToBook.checkOut);

    const baseCheckoutPath = "request-to-book-checkout";

    return `/${baseCheckoutPath}/${property.id}?checkIn=${checkIn}&checkOut=${checkOut}&numGuests=${requestToBook.numGuests}&requestPercentage=${requestPercentage}`;
  }, [property, requestToBook, requestPercentage]);

  return (
    <Button
      asChild={
        !property.stripeVerRequired ||
        verificationStatus?.isIdentityVerified === "true"
          ? !invalidInput
            ? true
            : false
          : false
      }
      variant={
        property.stripeVerRequired &&
        verificationStatus?.isIdentityVerified === "pending"
          ? "secondary"
          : "primary"
      }
      size={btnSize}
      className="w-full"
      disabled={invalidInput}
    >
      {!property.stripeVerRequired ||
      verificationStatus?.isIdentityVerified === "true" ? (
        !invalidInput ? (
          <Link href={checkoutUrl}>Request to book</Link>
        ) : (
          <p>Request to book</p>
        )
      ) : verificationStatus?.isIdentityVerified === "pending" ? (
        <p>Verification pending</p>
      ) : (
        <VerificationProvider>
          <IdentityModal isPrimary={true} />
          <p className="hidden text-center text-sm font-semibold text-red-500 md:block">
            This host requires you to go through Stripe verification before you
            book
          </p>
        </VerificationProvider>
      )}
    </Button>
  );
}
