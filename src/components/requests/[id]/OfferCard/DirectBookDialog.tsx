import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/utils/api";
import { TAX_PERCENTAGE } from "@/utils/constants";
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
import { useStripe } from "./HowToBookDialog";

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
  const tax = (offer.totalPrice + tramonaServiceFee) * TAX_PERCENTAGE;

  const totalPriceWithFees = offer.totalPrice + tramonaServiceFee + tax;

  async function checkout() {
    const response = await createCheckout.mutateAsync({
      listingId: offer.id,
      propertyId: offer.property.id,
      requestId: requestId,
      name: offer.property.name,
      price: totalPriceWithFees, // Airbnb (tramona fee) Set's price for checkout
      description: "From: " + formatDateRange(checkIn, checkOut),
      cancelUrl: cancelUrl,
      images: offer.property.imageUrls,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>

      <DialogContent className="w-screen md:w-[750px] ">
        <div className="rounded-t-lg bg-black py-2 text-center font-bold text-white">
          {discountPercentage}% OFF
        </div>
        <Card>
          <div className="flex justify-around">
            <div>
              <p>Check-in</p>
              <p className="font-bold">{checkInDate}</p>
            </div>
            <div>
              <p>Check-out</p>
              <p className="font-bold">{checkOutDate}</p>
            </div>
          </div>
        </Card>
        <div className="space-y-4 border-y py-4 text-muted-foreground">
          <p className="text-xl font-bold text-black">Price Details</p>
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
            <div className="flex justify-between py-2">
              <p className="underline">Taxes</p>
              <p>{formatCurrency(tax)}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between py-2">
          <p className="underline">Total (USD)</p>
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
