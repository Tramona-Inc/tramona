import CopyToClipboardBtn from "@/components/_utils/CopyToClipboardBtn";
import { Button, buttonVariants } from "@/components/ui/button";
import { env } from "@/env";
import { api } from "@/utils/api";
import { cn, formatCurrency, formatDateRange } from "@/utils/utils";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
    listingId: number;
    offerNightlyPrice: number;
    originalNightlyPrice: number;
    propertyName: string;
    airbnbUrl: string;
    checkIn: Date;
    checkOut: Date;
  }>,
) {
  const message = `Hi, I was offered your property on Tramona for ${formatCurrency(
    props.offerNightlyPrice,
  )} total for ${formatDateRange(
    props.checkIn,
    props.checkOut,
  )} and I'd like to book it at that price.`;

  const createCheckout = api.stripe.createCheckoutSession.useMutation();
  const stripePromise = useStripe();

  const cancelUrl = usePathname();

  async function checkout() {
    const response = await createCheckout.mutateAsync({
      listingId: props.listingId,
      name: props.propertyName,
      price: props.offerNightlyPrice,
      description:
        `Listing ID: ${props.listingId}/ ` +
        "From: " +
        formatDateRange(props.checkIn, props.checkOut),
      cancelUrl: cancelUrl,
      images: [
        "https://a0.muscache.com/im/pictures/prohost-api/Hosting-53368683/original/342a02dc-d6ae-4aa1-b519-8d10ecc8ba96.jpeg?im_w=1200",
      ],
    });

    const stripe = await stripePromise;

    if (stripe !== null) {
      await stripe.redirectToCheckout({
        sessionId: response.id,
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="mb-10 flex flex-col space-y-5">
            <div className="flex flex-row items-center justify-center gap-5">
              <div>
                <h1 className="font-bold">Tramona Price</h1>
                <p className="font-extrabold text-primary">
                  {formatCurrency(props.offerNightlyPrice)}
                  <span className="font-normal text-secondary-foreground">
                    /night
                  </span>
                </p>
              </div>
              <div className="text-muted-foreground">
                <h1 className="font-bold">Original Price</h1>
                <p className="font-extrabold">
                  {formatCurrency(props.originalNightlyPrice)}
                  <span className="font-normal">/night</span>
                </p>
              </div>
              <div className="font-bold">
                <h1 className="font-bold">From</h1>
                <p className="font-normal">
                  {formatDateRange(props.checkIn, props.checkOut)}
                </p>
              </div>
            </div>
            <Button
              className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
              onClick={() => checkout()}
            >
              Pay now
            </Button>
          </div>
          <DialogTitle>How To Book:</DialogTitle>
          <DialogDescription>
            Here&apos;s how to secure your booking.
          </DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-1 px-4 marker:text-muted-foreground">
          <li>
            First please pay by clicking{" "}
            <span className="inline-block rounded-full bg-primary pl-3 pr-2 text-white">
              Pay now
            </span>
          </li>
          <li>
            Once you click{" "}
            <span className="inline-block rounded-full bg-primary pl-3 pr-2 text-white">
              Book &rarr;
            </span>{" "}
            below, you will be taken to the listing page on Airbnb.
          </li>
          <li>
            Scroll to the bottom of the listing where it says “Contact Host”.
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
          <Link
            className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            href={props.airbnbUrl}
            target="_blank"
          >
            Book &rarr;
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
