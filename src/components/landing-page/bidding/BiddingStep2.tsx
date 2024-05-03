import { type Property } from "@/server/db/schema";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

import { useBidding } from "@/utils/store/bidding";
import { useStripe } from "@/utils/stripe-client";
import { formatCurrency, formatDateRange, getNumNights } from "@/utils/utils";
import { Elements } from "@stripe/react-stripe-js";
import { type StripeElementsOptions } from "@stripe/stripe-js";
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
  const stripePromise = useStripe();

  const date = useBidding((state) => state.date);
  const price = useBidding((state) => state.price);
  const guest = useBidding((state) => state.guest);
  const totalNightlyPrice = price * getNumNights(date.from, date.to);
  const totalPrice = totalNightlyPrice;


  const options: StripeElementsOptions = {
    mode: "payment",
    amount: totalPrice,
    currency: "usd",
  };

  const bid = {
    propertyId: property.id,
    numGuests: guest,
    amount: price,
    checkIn: date.from,
    checkOut: date.to,
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 text-sm md:space-y-1 md:text-xl ">
      <h1 className="text-lg font-semibold tracking-tight md:text-3xl">
        Step 2 of 2: Confirm Payment{" "}
      </h1>
      <BiddingInfoCard property={property} />
      <div className="flex flex-col items-center tracking-tight md:flex-row md:items-start md:space-x-20">
        <div className="mt-4 w-[300px] md:w-[500px]">
          <Elements stripe={stripePromise} options={options}>
            <BidPaymentForm bid={bid} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

export default BiddingStep2;
