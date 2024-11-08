import { api } from "@/utils/api";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Property } from "@/server/db/schema";
import { Airbnb } from "@/utils/listing-sites/Airbnb";
import { ArrowRightIcon, BookCheckIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { VerificationProvider } from "@/components/_utils/VerificationContext";
import IdentityModal from "@/components/_utils/IdentityModal";
import {
  type OfferWithDetails,
  RequestToBookDetails,
} from "./RequestToBookBtn";

interface BaseProps {
  btnSize: ButtonProps["size"];
  property: Pick<
    Property,
    "stripeVerRequired" | "originalListingId" | "bookOnAirbnb" | "maxNumGuests"
  >;
}

// Union type for either `requestToBook` or `offer`
type UnifiedProps =
  | (BaseProps & { requestToBook: RequestToBookDetails; offer?: never }) // With requestToBook
  | (BaseProps & { offer: OfferWithDetails; requestToBook?: never }); // With offer

export default function BookNowBtn(props: UnifiedProps) {
  const isBooked = props.offer?.acceptedAt ? true : false;

  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  const airbnbCheckoutUrl = props.offer
    ? Airbnb.createListing(props.property.originalListingId!).getCheckoutUrl({
        checkIn: props.offer.checkIn,
        checkOut: props.offer.checkIn,
        numGuests:
          props.offer.request?.numGuests ?? props.property.maxNumGuests,
      })
    : Airbnb.createListing(props.property.originalListingId!).getCheckoutUrl({
        checkIn: props.requestToBook.checkIn,
        checkOut: props.requestToBook.checkIn,
        numGuests: props.requestToBook.numGuests,
      });

  const checkoutUrl = props.offer
    ? `/offer-checkout/${props.offer.id}`
    : `book-it-now-checkout`; /// wait comback to this later
  return (
    <Button
      asChild={!isBooked}
      variant={
        props.property.stripeVerRequired &&
        verificationStatus?.isIdentityVerified === "pending"
          ? "secondary"
          : "primary"
      }
      size={props.btnSize}
      className="w-full"
      disabled={isBooked}
    >
      {isBooked ? (
        <>
          <BookCheckIcon className="size-5" />
          Booked
        </>
      ) : props.property.bookOnAirbnb ? (
        <Link
          href={airbnbCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book on Airbnb
          <ExternalLinkIcon className="size-5" />
        </Link>
      ) : !props.property.stripeVerRequired ||
        verificationStatus?.isIdentityVerified === "true" ? (
        <Link href={checkoutUrl}>
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
