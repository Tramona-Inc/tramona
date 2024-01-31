import CopyToClipboardBtn from "@/components/_utils/CopyToClipboardBtn";
import { Button, buttonVariants } from "@/components/ui/button";
import { env } from "@/env";
import { api } from "@/utils/api";
import { cn, formatCurrency, formatDateRange } from "@/utils/utils";
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
    offerNightlyPrice: number;
    originalNightlyPrice: number;
    propertyName: string;
    airbnbUrl: string;
    checkIn: Date;
    checkOut: Date;
    offer: OfferWithProperty;
    requestId: number;
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

  const session = useSession({ required: true });

  async function checkout() {
    const response = await createCheckout.mutateAsync({
      listingId: props.offer.id,
      propertyId: props.offer.property.id,
      requestId: props.requestId,
      name: props.offer.property.name,
      price: props.offerNightlyPrice,
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

  const [open, setOpen] = useState<boolean>(props.isBooked);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {!props.isBooked && (
            <>
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
            </>
          )}
          <DialogTitle>How To Book:</DialogTitle>
          <DialogDescription>
            Here&apos;s how to secure your booking.
          </DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-1 px-4 marker:text-muted-foreground">
          {!props.isBooked && (
            <li>
              First please pay by clicking{" "}
              <span className="inline-block rounded-full bg-primary pl-3 pr-2 text-white">
                Pay now
              </span>
            </li>
          )}
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
