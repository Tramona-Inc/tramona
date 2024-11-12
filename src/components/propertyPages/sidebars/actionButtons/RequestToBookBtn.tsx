import IdentityModal from "@/components/_utils/IdentityModal";
import { VerificationProvider } from "@/components/_utils/VerificationContext";
import { Button, ButtonProps } from "@/components/ui/button";
import { RouterOutputs } from "@/utils/api";
import { api } from "@/utils/api";
import {
  formatDateMonthDayYear,
  getApplicableBookItNowDiscount,
} from "@/utils/utils";
import Link from "next/link";
import { useMemo } from "react";
export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];
export type PropertyPageData = RouterOutputs["properties"]["getById"];

export type RequestToBookDetails = {
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  travelerOfferedPriceBeforeFees: number;
};

export default function RequestToBookBtn({
  btnSize,
  requestToBook,
  property,
}: {
  btnSize: ButtonProps["size"];
  requestToBook: RequestToBookDetails;
  property: PropertyPageData;
}) {
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  const checkoutUrl = useMemo(() => {
    const checkIn = formatDateMonthDayYear(requestToBook.checkIn);
    const checkOut = formatDateMonthDayYear(requestToBook.checkOut);

    const baseCheckoutPath =
      property.bookItNowEnabled &&
      getApplicableBookItNowDiscount({
        bookItNowDiscountTiers: property.bookItNowDiscountTiers,
        checkIn: requestToBook.checkIn,
      }) !== null
        ? "book-it-now-checkout"
        : "request-to-book-checkout";

    return `/${baseCheckoutPath}/${property.id}?checkIn=${checkIn}&checkOut=${checkOut}&numGuests=${requestToBook.numGuests}&travelerOfferedPriceBeforeFees=${requestToBook.travelerOfferedPriceBeforeFees}`;
  }, [property, requestToBook]);

  return (
    <Button
      asChild={
        !property.stripeVerRequired ||
        verificationStatus?.isIdentityVerified === "true"
      }
      variant={
        property.stripeVerRequired &&
        verificationStatus?.isIdentityVerified === "pending"
          ? "secondary"
          : "primary"
      }
      size={btnSize}
      className="w-full"
    >
      {!property.stripeVerRequired ||
      verificationStatus?.isIdentityVerified === "true" ? (
        <Link href={checkoutUrl}>Request to book</Link>
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
