import { type Property } from "@/server/db/schema";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import { useStripe } from "@/utils/stripe-client";
import { formatCurrency, formatDateRange, getNumNights } from "@/utils/utils";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import BidPaymentForm from "./BidPaymentForm";

function BiddingInfoCard({ property }: { property: Property }) {
  const date = useBidding((state) => state.date);
  const price = useBidding((state) => state.price);
  const totalNightlyPrice = price * getNumNights(date.from, date.to);
  const totalPrice = totalNightlyPrice;

  return (
    <div className="flex-col">
      <h2 className="mb-2 text-lg font-semibold md:mb-5 md:text-2xl">
        Offer Details
      </h2>
      <div className="flex max-w-full  items-center gap-4 rounded-2xl border-2 border-accent p-2">
        <div className="h-[85px] w-[85px] md:h-[160px] md:w-[160px] lg:h-[95px] lg:w-[95px]">
          <AspectRatio ratio={1} className="">
            <Image
              src={property.imageUrls[0]!}
              fill
              alt="Property Image"
              className="rounded-xl"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col text-sm tracking-tight md:text-base">
          <h2 className="font-bold ">{property.name}</h2>
          {property.originalNightlyPrice && (
            <p className="text-xs md:text-base">
              Airbnb price: {formatCurrency(property.originalNightlyPrice)}
              /night
            </p>
          )}
          <p className="mt-2 md:mt-3">Check-in/Check-out:</p>
          <p className="text-muted-foreground">
            {formatDateRange(date.from, date.to)}
          </p>
          <ul className=" my-2 flex flex-row gap-x-1  text-nowrap text-xs tracking-tighter text-muted-foreground md:my-4 md:space-x-1 md:text-base ">
            <li className="">{property.maxNumGuests} Guests</li>
            <li>·</li>
            <li>{property.numBedrooms} Bedrooms</li>
            <li>·</li>
            <li>{property.numBeds} Beds</li>
            <li>·</li>
            <li>{property.numBathrooms} Baths</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-y-2 text-xs font-semibold md:text-base">
        <div className="mt-8 flex flex-row justify-between ">
          <p>
            Offer Price: ${price} &times; {getNumNights(date.from, date.to)}{" "}
            nights
          </p>
          <p>${totalNightlyPrice} </p>
        </div>
        <hr />
        <div className="my-2 flex flex-row justify-between">
          <p>Offer Total</p>
          <p>${totalPrice} </p>
        </div>
      </div>
    </div>
  );
}

function BiddingStep2({ property }: { property: Property }) {
  const addPropertyIdBids = useBidding((state) => state.addPropertyIdBids);

  const { mutateAsync: createBiddingMutate } = api.biddings.create.useMutation({
    onSuccess: () => {
      addPropertyIdBids(property.id);
      setStep(step + 1);
    },
    onError: (error) => {
      console.log("error", error.message);
      setError(error.message);
    },
  });
  const { data: payments } = api.stripe.getListOfPayments.useQuery();
  const { data: session } = useSession();

  const [currentPaymentMethodId, setCurrentPaymentMethodId] = useState<
    string | undefined
  >(payments?.defaultPaymentMethod as string | undefined);
  const [error, setError] = useState("");

  const stripePromise = useStripe();

  const date = useBidding((state) => state.date);
  const price = useBidding((state) => state.price);
  const guest = useBidding((state) => state.guest);
  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);
  const totalNightlyPrice = price * getNumNights(date.from, date.to);
  const totalPrice = totalNightlyPrice;

  const options: StripeElementsOptions = {
    mode: "setup",
    currency: "usd",
    paymentMethodCreation: "manual",
  };

  const bid = {
    propertyId: property.id,
    numGuests: guest,
    amount: totalPrice * 100, //convert to stripe cents
    checkIn: date.from,
    checkOut: date.to,
  };

  async function onSubmit() {
    if (session?.user) {
      if (session.user.setupIntentId !== null) {
        await createBiddingMutate({
          ...bid,
          paymentMethodId: currentPaymentMethodId,
          setupIntentId: session.user.setupIntentId,
        });
      }
    }
  }

  useEffect(() => {
    setCurrentPaymentMethodId(
      payments?.defaultPaymentMethod as string | undefined,
    );
  }, [payments]);

  return (
    <div className="flex flex-col items-center justify-center space-y-5 text-sm md:space-y-1 md:text-xl ">
      <h1 className="text-lg font-semibold tracking-tight md:text-3xl">
        Step 2 of 2: Confirm Payment{" "}
      </h1>
      <BiddingInfoCard property={property} />
      <div className="mt-4 w-[300px] md:w-[500px]">
        {payments && payments.cards.data.length > 0 ? (
          <div className="space-y-5">
            <Select
              defaultValue={payments.defaultPaymentMethod as string}
              onValueChange={(value) => {
                setCurrentPaymentMethodId(value);
              }}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Credit Cards" />
              </SelectTrigger>
              <SelectContent>
                {payments.cards.data.map((payment) => (
                  <SelectItem key={payment.id} value={payment.id}>
                    **** **** **** {payment.card?.last4}{" "}
                    <span className="capitalize">{payment.card?.brand}</span>{" "}
                    {payment.card?.exp_month}/{payment.card?.exp_year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={onSubmit} type="submit">
              Send Offer
            </Button>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={options}>
            <BidPaymentForm bid={bid} />
          </Elements>
        )}
      </div>
      <p>{error}</p>
    </div>
  );
}

export default BiddingStep2;
