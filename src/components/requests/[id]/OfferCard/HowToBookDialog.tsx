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
      price: props.isAirbnb ? tramonafee : props.totalPrice,
      description: "From: " + formatDateRange(props.checkIn, props.checkOut),
      cancelUrl: cancelUrl,
      images: props.offer.property.imageUrls,
      userId: session.data?.user.id ?? "",
    });

    const stripe = await stripePromise;

    if (stripe !== null) {
      await stripe.redirectToCheckout({
        sessionId: response.id,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        {!props.isBooked && (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-5xl">
                Confirm Booking:
              </DialogTitle>
            </DialogHeader>

            {props.isAirbnb ? (
              <div className="flex flex-row items-center justify-center gap-10 font-bold">
                <div className="text-center">
                  <h1 className="text-md">Tramona Price</h1>
                  <p className="text-lg font-extrabold text-primary">
                    {formatCurrency(props.offerNightlyPrice)}
                    <span className="font-normal text-secondary-foreground">
                      /night
                    </span>
                  </p>
                </div>
                <div className="text-center">
                  <h1 className="text-md">Original Price</h1>
                  <p className="text-lg text-muted-foreground">
                    {formatCurrency(props.originalNightlyPrice)}
                    <span className="font-normal text-secondary-foreground">
                      /night
                    </span>
                  </p>
                </div>
                <div className="text-center">
                  <h1 className="text-md">Savings</h1>
                  <p className="text-lg text-primary">
                    {formatCurrency(totalSavings)}
                  </p>
                </div>
                <div className="text-center">
                  <h1 className="text-md">Tramona Fee</h1>
                  <p className="text-lg text-primary">
                    {formatCurrency(tramonafee)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-10 font-bold">
                <div className="text-center">
                  <h1 className="text-lg">Tramona Price</h1>
                  <p className="text-xl font-extrabold text-primary">
                    {formatCurrency(props.totalPrice)}
                  </p>
                </div>
                <div className="text-center">
                  <h1 className="text-lg">Original Price</h1>
                  <p className="text-xl text-muted-foreground">
                    {formatCurrency(originalTotalPrice)}
                  </p>
                </div>
                <div className="text-center">
                  <h1 className="text-lg">Savings</h1>
                  <p className="text-xl text-primary">
                    {formatCurrency(originalTotalPrice - props.totalPrice)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {props.isAirbnb ? (
          <>
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
                  * Note: paying the Tramona fee does not mean the property is
                  booked for you. You must complete all the steps
                </p>
              </>
            )}
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
                  <span className="inline-block rounded-full bg-primary px-3 pr-2 text-white">
                    Pay now
                  </span>{" "}
                  and pay the Tramona Fee, you will be given the specific
                  instructions on how to book your stay on Airbnb.
                </li>
              )}
              <li>
                Once you click{" "}
                <span className="inline-block rounded-full bg-primary pl-3 pr-2 text-white">
                  Contact Host &rarr;
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
              {/* Default is booked is false in request Page */}
              {props.isBooked ? (
                <Link
                  className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
                  href={props.airbnbUrl}
                  target="_blank"
                >
                  Contact Host &rarr;
                </Link>
              ) : (
                <Button
                  disabled={true}
                  className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
                >
                  Contact Host &rarr;
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="container flex flex-col px-10 py-5">
              <ol className="flex list-decimal flex-col text-start marker:text-muted-foreground">
                <li>
                  Once you click pay now and pay the total, your booking is
                  confirmed.
                </li>
                <li>
                  You will be able to see the trip under “my trips” and see
                  confirmation, check-in instructions and more.
                </li>
                <li>
                  A copy of your booking confirmation, check-in instructions and
                  host contact info will be emailed to you.
                </li>
              </ol>
            </div>

            <DialogFooter className="flex items-center justify-center">
              <Button
                className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
                onClick={() => checkout()}
              >
                Pay now
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
