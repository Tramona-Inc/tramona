import { type Property } from "@/server/db/schema";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import { useStripe } from "@/utils/stripe-client";
import { formatCurrency, formatDateRange, getNumNights } from "@/utils/utils";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

function BiddingStep2({ property }: { property: Property }) {
  const date = useBidding((state) => state.date);
  const guest = useBidding((state) => state.guest);
  const price = useBidding((state) => state.price);
  const options = useBidding((state) => state.options);
  const resetSession = useBidding((state) => state.resetSession);

  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);

  const totalNightlyPrice = price * getNumNights(date.from, date.to) ?? 1;

  const tax = 1;

  const totalPrice = totalNightlyPrice * tax;

  const { mutate } = api.biddings.create.useMutation({
    onSuccess: () => {
      resetSession();
      setStep(step + 1);
    },
  });

  function handleOffer() {
    mutate({
      propertyId: property.id,
      numGuests: guest,
      amount: price,
      checkIn: date.from,
      checkOut: date.to,
    });
  }

  const stripePromise = useStripe();


  return (
    <div className="flex flex-col items-center justify-center space-y-5 text-sm md:space-y-1 md:text-xl ">
      <h1 className="text-lg font-semibold tracking-tight md:text-3xl">
        Step 2 of 2: Confirm Payment{" "}
      </h1>
      <div className="flex flex-col items-center tracking-tight md:flex-row md:items-start md:space-x-20">
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
          {/* Price Breakdown */}
          <div className="flex flex-col gap-y-2 text-xs font-semibold md:text-base">
            <div className="mt-8 flex flex-row justify-between ">
              <p>
                Offer Price: ${price} &times;{" "}
                {getNumNights(date.from ?? new Date(), date.to ?? new Date())}{" "}
                nights
              </p>
              <p>${totalNightlyPrice} </p>
            </div>
            {/* <div className="my-4 flex flex-row justify-between">
              <p>Taxes</p>
              <p>$20</p>
            </div> */}
            <hr />
            <div className="my-2 flex flex-row justify-between">
              <p>Offer Total</p>
              <p>${totalPrice} </p>
            </div>
          </div>
        </div>
        <div className="mt-4 w-[300px] md:w-[500px]">
          {options && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret: options.client_secret ?? "" }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}

          <div className="flex w-full justify-center">
            <Button className="my-6 w-full py-5 text-lg" onClick={handleOffer}>
              Send Offer
            </Button>
          </div>

          {/* <div className="flex w-full flex-col items-center gap-y-4 rounded-xl bg-popover px-4 py-6 md:py-20">
          <Button className="w-full md:px-32 ">
            <FaApplePay size={48} />
          </Button>
          <div className=" mt-5 flex w-11/12 flex-row text-sm text-accent">
            <div className="mt-2 w-full border-t-2 border-accent" />
            <span className="mx-4 text-nowrap text-muted-foreground">
              Or pay with card
            </span>
            <div className="mt-2 w-full border-t-2 border-accent" />
          </div>
          <div className="item-center flex w-full flex-col text-base">
            <Label htmlFor="email" className="mb-2">
              Card Information
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              className="mb-2"
            />
            <div className="mb-10 grid grid-cols-2 gap-2">
              <Input placeholder="MM / YY" className="" />
              <Input placeholder="123" className="" />
            </div>

            <Label className="mb-2">Country or Region</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Zip code" />
            <Button
              className="my-6 py-5 text-lg"
              onClick={() => handlePressNext()}
            >
              Send Offer
            </Button>
            <p className="text-xs text-muted-foreground">
              Offers are binding. If your offer is accepted, your card will be
              charged.
            </p>
            <p className="mt-10 text-center text-xs">
              Host cancellation policy{" "}
              <span className="text-blue-500 underline">Learn more</span>
            </p>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
}

export default BiddingStep2;
