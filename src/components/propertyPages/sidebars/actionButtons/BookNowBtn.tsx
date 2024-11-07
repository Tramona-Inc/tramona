import { api } from "@/utils/api";
import type { OfferWithDetails } from "../../PropertyPage";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Property } from "@/server/db/schema";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { ArrowRightIcon, BookCheckIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { VerificationProvider } from "@/components/_utils/VerificationContext";
import IdentityModal from "@/components/_utils/IdentityModal";
import { RequestToBookDetails } from "./RequestToBookBtn";

export default function BookNowBtn({
  btnSize,
  property,
  requestToBook, //we need this for the dates for now
}: {
  btnSize: ButtonProps["size"];
  property: Pick<
    Property,
    "stripeVerRequired" | "originalListingId" | "bookOnAirbnb"
  >;
  requestToBook: RequestToBookDetails;
}) {
  const isBooked = false;

  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  const airbnbCheckoutUrl = Airbnb.createListing(
    property.originalListingId!,
  ).getCheckoutUrl({
    checkIn: requestToBook.checkIn,
    checkOut: requestToBook.checkOut,
    numGuests: requestToBook.numGuests,
  });

  return (
    <Button
      asChild={!isBooked}
      variant={
        property.stripeVerRequired &&
        verificationStatus?.isIdentityVerified === "pending"
          ? "secondary"
          : "primary"
      }
      size={btnSize}
      className="w-full"
      disabled={isBooked}
    >
      {isBooked ? (
        <>
          <BookCheckIcon className="size-5" />
          Booked
        </>
      ) : property.bookOnAirbnb ? (
        <Link
          href={airbnbCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book on Airbnb
          <ExternalLinkIcon className="size-5" />
        </Link>
      ) : !property.stripeVerRequired ||
        verificationStatus?.isIdentityVerified === "true" ? (
        <Link href={`/offer-checkout/$}`}>
          Book now
          <ArrowRightIcon className="size-5" />
        </Link>
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
