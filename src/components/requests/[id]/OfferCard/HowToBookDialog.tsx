import CopyToClipboardBtn from "@/components/_utils/CopyToClipboardBtn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type OfferWithProperty } from ".";
import ProgressBar from "../../../payment-forms/progress-bar";
import { Dialog, DialogContent, DialogTrigger } from "../../../ui/dialog";

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
  const messageToHost = `Hi, I was offered your property on Tramona for ${formatCurrency(
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
      totalSavings,
    });

    const stripe = await stripePromise;

    if (stripe !== null) {
      await stripe.redirectToCheckout({
        sessionId: response.id,
      });
    }
  }

  const [isDialog, setIsDialog] = useState(false);
  const [tab, setTab] = useState<number>(props.isBooked ? 2 : 1);
  const { isAirbnb, totalPrice } = props;

  useEffect(() => {
    if (props.isBooked) {
      setTab(2);
    }
  }, [props.isBooked]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>

      <DialogContent className="w-screen p-10 md:w-[750px] ">
        <h1 className="mt-8 text-4xl font-bold">Confirm and Pay</h1>

        <div className="mt-10 space-y-10 pr-5 md:mt-0">
          {/* <h1 className="mt-10 text-4xl font-bold">Confirm and Pay</h1> */}
          <div className="space-y-5">
            {/* Step 1 */}
            <div
              className={cn(
                "flex h-full flex-row space-x-6 transition duration-1000 ",
                1 <= tab ? "opacity-100" : "opacity-50",
              )}
            >
              <ProgressBar step={tab} currenttab={1} />
              <div className="w-full space-y-5">
                <div>
                  <h4 className="text-xs ">Step 1</h4>
                  <h5 className="text-xl font-semibold">Pay the Tramona fee</h5>
                </div>

                <div className="space-y-2 text-sm">
                  <p>Non Tramona Price: {formatCurrency(originalTotalPrice)}</p>
                  <p>Tramona Price: {formatCurrency(totalSavings)}</p>
                  <p>
                    Total savings with Tramona: {formatCurrency(totalPrice)}
                  </p>
                  <p>
                    Tramona Fee: {formatCurrency(totalPrice * 0.2)} (
                    <span className="italic">
                      We charge a 20% fee of your total savings).
                    </span>
                  </p>
                </div>

                <div className="py-2">
                  <div className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-4  text-xs">
                    <span className="italic">*Notes:</span> Paying the Tramona
                    fee does not guarantee a successful booking. If you fail, we
                    will refund you.
                  </div>
                </div>

                <div className="mt-2 flex w-full flex-col gap-y-3">
                  <h1 className="font-semibold">Price details</h1>
                  <div className="flex w-1/2 flex-row justify-between">
                    <p>Tramona Fee</p>
                    <p>{formatCurrency(totalPrice * 0.2)}</p>
                  </div>
                  <div className="flex w-1/2 flex-row justify-between font-bold">
                    <p>Total</p>
                    <p>{formatCurrency(totalPrice * 0.2)}</p>
                  </div>
                </div>
                {/* <Button className="w-2/5">Pay now</Button> */}

                <Button
                  className="w-2/5"
                  onClick={() => checkout()}
                  disabled={!createCheckout.isIdle || props.isBooked}
                >
                  Pay now
                </Button>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={cn(
                "flex h-full flex-row space-x-6 transition duration-1000 ",
                2 <= tab ? "opacity-100" : "opacity-50",
              )}
            >
              <ProgressBar step={tab} currenttab={2} />

              <div className="w-full space-y-5">
                <div>
                  <h4 className="text-xs ">Step 2</h4>
                  <h5 className="text-xl font-semibold">
                    Airbnb link gets unlocked
                  </h5>
                </div>
                <Input
                  placeholder="https://www.airbnb.com/rooms/xxxxxxxx"
                  className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-7  text-xs italic"
                  disabled={!props.isBooked}
                  value={!props.isBooked ? "" : props.airbnbUrl}
                />

                <CopyToClipboardBtn
                  message={props.airbnbUrl}
                  render={({ justCopied, copyMessage }) => (
                    <Button
                      className="border border-black bg-white text-black"
                      disabled={!props.isBooked}
                      onClick={() => {
                        copyMessage();
                        setTab(3);
                      }}
                    >
                      {justCopied ? "Copied!" : "Copy link"}
                    </Button>
                  )}
                />
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={cn(
                "flex h-full flex-row space-x-6 transition duration-1000 ",
                3 <= tab ? "opacity-100" : "opacity-50",
              )}
            >
              <ProgressBar step={tab} currenttab={3} />

              <div className="w-full space-y-5">
                <div>
                  <h4 className="text-xs ">Step 3</h4>
                  <h5 className="text-xl font-semibold">
                    Contact the host through the chat feature on Airbnb by copy
                    and pasting our premade message
                  </h5>
                </div>

                <div className="rounded-md border-2 border-dashed border-[#636363] bg-[#E5E5E5] p-4  text-xs italic">
                  {messageToHost}
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-x-8 md:space-y-0">
                  <CopyToClipboardBtn
                    message={messageToHost}
                    render={({ justCopied, copyMessage }) => (
                      <Button
                        className="border border-black bg-white text-black"
                        disabled={!props.isBooked}
                        onClick={() => {
                          copyMessage();
                          setTab(5);
                        }}
                      >
                        {justCopied ? "Copied!" : "Copy link"}
                      </Button>
                    )}
                  />
                  <Button disabled={!props.isBooked}>Contact host</Button>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div
              className={cn(
                "flex h-full flex-row space-x-6 transition duration-1000 ",
                4 <= tab ? "opacity-100" : "opacity-50",
              )}
            >
              <ProgressBar step={tab} currenttab={4} />

              <div className="w-full space-y-5">
                <div>
                  <h4 className="text-xs ">Step 4</h4>
                  <h5 className="text-xl font-semibold">
                    Receive exclusive offer from the host
                  </h5>
                  <p className="text-sm">
                    This will happen on Airbnb, through the chat
                  </p>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div
              className={cn(
                "flex h-full flex-row space-x-6 transition-opacity duration-1000 ",
                5 === tab ? "opacity-100" : "opacity-50",
              )}
            >
              {tab === 5 ? (
                <div className="mt-6 h-4 w-4 items-center justify-center rounded-full bg-black" />
              ) : (
                <div className="mt-6 h-4 w-4 items-center justify-center rounded-full border-[3px] border-black opacity-50 " />
              )}

              <div className="w-full space-y-5">
                <div>
                  <h4 className="text-xs ">Step 5</h4>
                  <h5 className="text-xl font-semibold">You&apos;re done!</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
