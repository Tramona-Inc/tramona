import CopyToClipboardBtn from "@/components/_utils/CopyToClipboardBtn";
import { Button, buttonVariants } from "@/components/ui/button";
import { env } from "@/env";
import { api } from "@/utils/api";
import {
  cn,
  formatCurrency,
  formatDateRange,
  getNumNights,
  getTramonaFeeTotal,
} from "@/utils/utils";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { ArrowRightIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { type OfferWithProperty } from ".";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";

const useStripe = () => {
  const stripe = useMemo<Promise<Stripe | null>>(
    () => loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    [],
  );

  return stripe;
};

type PriceDetailsProps = {
  title: string;
  value: number;
  color: string;
  isNight?: boolean;
};

const PriceDetails: React.FC<PriceDetailsProps> = ({
  title,
  value,
  color,
  isNight = false,
}) => (
  <div className="text-center">
    <h1 className="text-md">{title}</h1>
    <div className="flex items-center justify-center">
      <p className={`text-lg ${color}`}>{formatCurrency(value)}</p>
      {isNight && <span className="text-sm">/night</span>}
    </div>
  </div>
);

export default function HowToBookDialog(
  props: React.PropsWithChildren<{
    isBooked: boolean;
    listingId: number;
    totalPrice: number;
    offerNightlyPrice: number;
    originalNightlyPrice: number;
    propertyName: string;
    airbnbUrl: string;
    checkIn: Date;
    checkOut: Date;
    offer: OfferWithProperty;
    requestId: number;
    isAirbnb: boolean;
  }>,
) {
  const message = `Hi, I was offered your property on Tramona for ${formatCurrency(
    props.totalPrice,
  )} total for ${formatDateRange(
    props.checkIn,
    props.checkOut,
  )} and I'd like to book it at that price.`;

  const createCheckout = api.stripe.createCheckoutSession.useMutation();
  const stripePromise = useStripe();
  const cancelUrl = usePathname();
  const session = useSession({ required: true });
  const [open, setOpen] = useState<boolean>(props.isBooked);
  const originalTotalPrice =
    props.originalNightlyPrice * getNumNights(props.checkIn, props.checkOut);
  const totalSavings = originalTotalPrice - props.totalPrice;
  const tramonafee = getTramonaFeeTotal(totalSavings);

  async function checkout() {
    const response = await createCheckout.mutateAsync({
      listingId: props.offer.id,
      propertyId: props.offer.property.id,
      requestId: props.requestId,
      name: props.offer.property.name,
      price: props.isAirbnb ? tramonafee : props.totalPrice, // Set's price for checkout
      description: "From: " + formatDateRange(props.checkIn, props.checkOut),
      cancelUrl: cancelUrl,
      images: props.offer.property.imageUrls,
      userId: session.data?.user.id ?? "",
      phoneNumber: session.data?.user.phoneNumber ?? "",
    });

    const stripe = await stripePromise;

    if (stripe !== null) {
      await stripe.redirectToCheckout({
        sessionId: response.id,
      });
    }
  }

  const renderPriceDetails = () => {
    // const { isAirbnb, offerNightlyPrice, originalNightlyPrice, totalPrice } = props;
    const { isAirbnb, totalPrice } = props;

    if (isAirbnb) {
      return (
        <div className="flex flex-row items-center justify-center gap-5 font-bold sm:gap-10">
          {/* <PriceDetails
            title="Tramona Price"
            value={offerNightlyPrice}
            color="font-extrabold text-primary"
            isNight={true}
          />
          <PriceDetails
            title="Original Price"
            value={originalNightlyPrice}
            color="text-muted-foreground"
            isNight={true}
          /> */}
          <PriceDetails
            title="Total Savings"
            value={totalSavings}
            color="text-primary"
          />
          <PriceDetails
            title="Tramona Fee"
            value={tramonafee}
            color="text-primary"
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-row items-center justify-center gap-10 font-bold">
          <PriceDetails
            title="Tramona Price"
            value={totalPrice}
            color="font-extrabold text-primary"
          />
          <PriceDetails
            title="Original Price"
            value={originalTotalPrice}
            color="text-muted-foreground"
          />
          <PriceDetails
            title="Savings"
            value={originalTotalPrice - totalPrice}
            color="text-primary"
          />
        </div>
      );
    }
  };

  const renderBookingDetails = () => {
    const { isAirbnb, isBooked } = props;

    if (isAirbnb) {
      return (
        <DialogHeader>
          <DialogTitle className="text-center text-5xl">
            {isBooked ? "One Last Step!" : "Confirm Booking"}
          </DialogTitle>
        </DialogHeader>
      );
    } else {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="text-center text-5xl">
              {isBooked ? "Thank you for Booking!" : "Confirm Booking:"}
            </DialogTitle>
          </DialogHeader>
        </>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          {/* Displaying Prices when not booked*/}
          {renderBookingDetails()}
          {!props.isBooked && <>{renderPriceDetails()}</>}
          {props.isAirbnb ? (
            <>
              {/* Airbnb and display pay button */}
              {!props.isBooked && (
                <>
                  <div className="flex flex-col">
                    <Button
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "rounded-full",
                      )}
                      onClick={() => checkout()}
                    >
                      Pay now
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    *Note: paying the Tramona fee does not mean the property is
                    booked for you. You must complete all the steps.
                  </p>
                </>
              )}
              {/* Airbnb flow and instructions */}
              <DialogHeader>
                <DialogTitle>How To Book:</DialogTitle>
                <DialogDescription>
                  Here&apos;s how to secure your booking.
                </DialogDescription>
              </DialogHeader>
              <ol className="list-decimal space-y-1 px-4 marker:text-muted-foreground">
                <li>We charge a 20% fee of your total savings.</li>
                {!props.isBooked && (
                  <li>
                    Once you click{" "}
                    <span className="inline-block rounded-full bg-primary px-2 text-white">
                      Pay now
                    </span>{" "}
                    and pay the Tramona Fee, you will be given the specific
                    instructions on how to book your stay on Airbnb.
                  </li>
                )}
                <li>
                  Once you click{" "}
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary pl-2 pr-1 text-white">
                    Contact Host
                    <ArrowRightIcon className="size-5" />
                  </span>{" "}
                  below, you will be taken to the listing page on Airbnb.
                </li>
                <li>
                  Scroll to the bottom of the listing where it says “Contact
                  Host”.
                </li>
                <li>Click “Contact Host” and send them this message:</li>
              </ol>
              <p className="border-l-2 border-primary bg-primary/10 p-2">
                ”{message}”
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <CopyToClipboardBtn
                  message={message}
                  render={({ justCopied, copyMessage }) => (
                    <Button
                      className="rounded-full"
                      size="lg"
                      variant="outline"
                      onClick={copyMessage}
                    >
                      {justCopied ? "Copied!" : "Copy message"}
                    </Button>
                  )}
                />
                {/* Enable contact host once paid */}
                {props.isBooked ? (
                  <Link
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-full",
                    )}
                    href={props.airbnbUrl}
                    target="_blank"
                  >
                    Contact Host
                    <ArrowRightIcon />
                  </Link>
                ) : (
                  <Button
                    disabled={true}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-full",
                    )}
                  >
                    Contact Host
                    <ArrowRightIcon />
                  </Button>
                )}
              </div>
            </>
          ) : (
            // Direct booking flow and instructions
            <>
              <div className="container flex flex-col px-10 py-5">
                <ol className="flex list-decimal flex-col text-start marker:text-muted-foreground">
                  {!props.isBooked && (
                    <li>
                      Once you click pay now and pay the total, your booking is
                      confirmed.
                    </li>
                  )}
                  <li>
                    You will be able to see the trip under{" "}
                    <span className="inline-flex rounded-full bg-primary pl-3 pr-2 text-white">
                      My Trips
                      <ArrowRightIcon />
                    </span>{" "}
                    and see confirmation, check-in instructions and more.
                  </li>
                  <li>
                    A copy of your booking confirmation, check-in instructions
                    and host contact info will be emailed to you.
                  </li>
                </ol>
              </div>
              <DialogFooter className="flex items-center justify-center">
                {props.isBooked ? (
                  // Direct Booking once paid link to trip
                  <Link
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-full",
                    )}
                    href={""} // TODO: href to my listing
                    target="_blank"
                  >
                    My Trips
                    <ArrowRightIcon />
                  </Link>
                ) : (
                  // Direct Booking pay first
                  <Button
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-full",
                    )}
                    onClick={() => checkout()}
                  >
                    Pay now
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
