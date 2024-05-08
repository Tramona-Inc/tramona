import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { useStripe } from "@/utils/stripe-client";
import {
  formatCurrency,
  formatDateMonthDay,
  formatDateRange,
  getDiscountPercentage,
  getNumNights,
  getTramonaFeeTotal,
} from "@/utils/utils";
import { CheckIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { type OfferWithProperty } from ".";

export default function DirectBookDialog(
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
  }>,
) {
  const {
    isBooked,
    offer,
    originalNightlyPrice,
    checkIn,
    checkOut,
    requestId,
    totalPrice,
    offerNightlyPrice,
  } = props;

  const [open, setOpen] = useState<boolean>(isBooked);

  const originalTotalPrice =
    originalNightlyPrice * getNumNights(checkIn, checkOut);
  const totalSavings = originalTotalPrice - totalPrice;

  const createCheckout = api.stripe.createCheckoutSession.useMutation();
  const stripePromise = useStripe();
  const cancelUrl = usePathname();
  const session = useSession({ required: true });

  const discountPercentage = getDiscountPercentage(
    originalNightlyPrice,
    offerNightlyPrice,
  );
  const checkInDate = formatDateMonthDay(checkIn);
  const checkOutDate = formatDateMonthDay(checkOut);
  const numNights = getNumNights(checkIn, checkOut);
  const originalTotal = originalNightlyPrice * numNights;
  const tramonaServiceFee = getTramonaFeeTotal(
    originalTotal - offer.totalPrice,
  );
  // const tax = (offer.totalPrice + tramonaServiceFee) * TAX_PERCENTAGE;

  const tax = 0;

  const totalPriceWithFees = offer.totalPrice + tramonaServiceFee + tax;

  async function checkout() {
    const user = session.data?.user;
    if (!user) return;

    const response = await createCheckout.mutateAsync({
      listingId: offer.id,
      propertyId: offer.property.id,
      requestId: requestId,
      name: offer.property.name,
      price: totalPriceWithFees, // Airbnb (tramona fee) Set's price for checkout
      description: "From: " + formatDateRange(checkIn, checkOut),
      cancelUrl: cancelUrl,
      images: offer.property.imageUrls,
      totalSavings,
      phoneNumber: session.data?.user.phoneNumber ?? "",
      userId: user.id,
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

      <DialogContent className="w-screen md:w-[500px] ">
        <div className="rounded-md bg-white shadow-md">
          <div className="rounded-t-md bg-black py-2 text-center font-bold text-white">
            {discountPercentage}% OFF
          </div>
          <div className="flex items-center justify-around p-3">
            <div>
              <p>Check-in</p>
              <p className="font-bold">{checkInDate}</p>
            </div>
            <div className="h-[1px] w-[75px] border-[1px]" />

            <div>
              <p>Check-out</p>
              <p className="font-bold">{checkOutDate}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 py-4 text-muted-foreground">
          <h1 className="text-xl font-bold text-black">Price Details</h1>
          <div className="-space-y-1 text-black">
            <div className="flex justify-between py-2 text-muted-foreground">
              <p>Non Tramona Price</p>
              <p>{formatCurrency(originalNightlyPrice)}/night</p>
            </div>
            <div className="flex justify-between py-2 ">
              <p>Tramona Price</p>
              <p>{formatCurrency(offerNightlyPrice)}/night</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 border-y py-4 text-muted-foreground">
          <h1 className="text-xl font-bold text-black">Final Price Details</h1>
          <div className="-space-y-1 text-black">
            <div className="flex justify-between py-2">
              <p className="underline">
                {formatCurrency(offerNightlyPrice)} &times; {numNights} nights
              </p>
              <div className="flex">
                <p className="text-zinc-400 line-through">
                  {formatCurrency(originalTotal)}
                </p>
                <p className="ms-1">{formatCurrency(offer.totalPrice)}</p>
              </div>
            </div>
            <div className="flex justify-between py-2">
              <p className="underline">Tramona service fee</p>
              <p>{formatCurrency(tramonaServiceFee)}</p>
            </div>
            {/* <div className="flex justify-between py-2">
              <p className="underline">Taxes</p>
              <p>{formatCurrency(tax)}</p>
            </div> */}
          </div>
        </div>
        <div className="flex justify-between py-2">
          <p className="font-bold underline">Total (USD)</p>
          <p className="font-bold">{formatCurrency(totalPriceWithFees)}</p>
        </div>
        <Button
          size="lg"
          className="w-full rounded-full"
          onClick={() => checkout()}
          disabled={isBooked}
        >
          {isBooked ? (
            <>
              <CheckIcon className="size-5" />
              Booked
            </>
          ) : (
            <>Confirm Booking</>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
