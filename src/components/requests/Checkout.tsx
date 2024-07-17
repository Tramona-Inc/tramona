import { ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";

import {
  formatCurrency,
  getDiscountPercentage,
  getNumNights,
} from "@/utils/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type OfferWithDetails } from "../offers/OfferPage";
import { formatDateWeekMonthDay, plural } from "@/utils/utils";
import { TAX_PERCENTAGE } from "@/utils/constants";
import { useChatWithAdmin } from "@/utils/useChatWithAdmin";
import StripePaymentInfo from "./StripePaymentInfo";
import { useMediaQuery } from "../_utils/useMediaQuery";
import { Offer } from "@/server/db/schema";

export default function Checkout({
  offer: { property, request, ...offer },
}: {
  offer: OfferWithDetails;
}) {
  const isMediumScreen = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const chatWithAdmin = useChatWithAdmin();

  function BestPriceCard() {
    return (
      <div className="rounded-lg border border-zinc-500 bg-zinc-100 p-3 text-sm">
        <h3 className="font-bold">Best price</h3>
        <p className="font-semibold text-muted-foreground">
          This is an exclusive price only available on Tramona.
        </p>
      </div>
    );
  }

  function TripDetails() {
    return (
      <>
        <div className="space-y-2 md:my-8">
          <h2 className="text-lg font-semibold">Your trip details</h2>
          <div className="text-sm">
            <p className="text-muted-foreground">Dates</p>
            <p className="font-bold">
              {formatDateWeekMonthDay(offer.checkIn)} -{" "}
              {formatDateWeekMonthDay(offer.checkOut)}
            </p>
          </div>
          {request && (
            <div className="text-sm">
              <p className="text-muted-foreground">Guests</p>
              <p className="font-bold">{plural(request.numGuests, "guest")}</p>
            </div>
          )}
        </div>
      </>
    );
  }

  function CancellationPolicy() {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Cancellation Policy</h3>
        <p className="text-sm leading-5 text-muted-foreground">
          {property.cancellationPolicy ??
            "This property has a no-cancellation policy. All payments are final and non-refundable if a cancellation occurs."}
        </p>
      </div>
    );
  }

  const formSchema = z.object({
    email: z.string().email(),
    phone: z.string().min(10),
  });

  type FormSchema = z.infer<typeof formSchema>;

  function ContactInfo() {
    const form = useForm<FormSchema>({ resolver: zodResolver(formSchema) });

    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <p className="text-sm text-muted-foreground">
          We encourage every traveler to have the travel details in case of
          emergencies.
        </p>
        <Form {...form}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>
    );
  }

  function TermsAndSubmit() {
    return (
      <div className="md:mt-8">
        <div className="mb-8 space-y-4 text-muted-foreground">
          <p className="text-sm font-semibold leading-5">
            On behalf of Tramona we ask that you please follow the house rules
            and treat the house as if it were your own
          </p>
          <p className="px-2 text-xs md:px-0">
            By selecting the button, I agree to the booking terms. I also agree
            to the Terms of Service, Payment Terms of Service and I acknowledge
            the Privacy Policy
          </p>
        </div>
        <Button variant="greenPrimary" className="w-full font-semibold sm:my-2">
          Confirm and pay
        </Button>
        <p className="my-4 text-center text-xs font-semibold text-muted-foreground md:my-0">
          As soon as you book you will get an email and text confirmation with
          all booking details
        </p>
      </div>
    );
  }

  const nightlyPrice =
    offer.totalPrice / getNumNights(offer.checkIn, offer.checkOut);

  function CheckoutSummary() {
    return (
      <div>
        <div className="md:rounded-t-xl md:border md:border-b-0 md:p-3">
          <h2 className="mb-4 text-lg font-semibold md:hidden">
            Price Details
          </h2>
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={property.imageUrls[0]!}
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold">{property.name}</h3>
                <p className="text-xs">{property.propertyType}</p>
                <div className="flex items-center gap-1">
                  <Star size={10} />
                  <p className="text-xs">
                    {property.avgRating} (
                    {plural(property.numRatings, "review")})
                  </p>
                </div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <h3 className="font-bold">Included with Tramona</h3>
              <div className="space-y-1 text-muted-foreground">
                <p>Lowest fees on the market</p>
                <p>24/7 concierge support</p>
                <p>Lowest price on the market</p>
                <p>No worries or hassles</p>
              </div>
            </div>
            <Separator className="my-4" />
          </div>
          <OfferPriceDetails offer={offer} />
        </div>
        <div className="rounded-md bg-teal-900 md:rounded-b-xl md:rounded-t-none">
          <h2 className="py-1 text-center text-lg font-semibold text-white md:py-2">
            {property.originalNightlyPrice &&
              getDiscountPercentage(
                property.originalNightlyPrice,
                nightlyPrice,
              )}
            % Off
          </h2>
        </div>
      </div>
    );
  }

  function CustomerReview() {
    return (
      <div className="relative w-full overflow-hidden rounded-xl">
        <div className="h-96">
          <Image
            src="/assets/images/review-image.png"
            width={300}
            height={300}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 m-4">
          <div className="space-y-2 rounded-xl bg-black/60 p-3 text-sm text-white backdrop-blur-sm">
            <p>
              &quot;My experience with Tramona has been wonderful. Any questions
              I have I hear back instantly, and the prices are truly unbeatable.
              Every time a friend is thinking of traveling i always recommend
              Tramona.&quot;
            </p>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/assets/images/review-customer.png" />
              </Avatar>
              <p>Jack P from San Diego, CA</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <Button
        variant="ghost"
        className="rounded-full font-semibold"
        onClick={router.back}
      >
        <ChevronLeft />
        Offers
      </Button>
      <h1 className="py-8 text-2xl font-bold">Confirm and pay</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {isMediumScreen ? (
          <div className="hidden md:block">
            <BestPriceCard />
            <TripDetails />
            <Separator className="my-4" />
            <CancellationPolicy />
            <Separator className="my-4" />
            <ContactInfo />
            {/* <Separator className="my-4" />
            <TermsAndSubmit /> */}
            <Separator className="my-4" />
            <StripePaymentInfo offer={{ property, request, ...offer }} />
          </div>
        ) : (
          <div className="md:hidden">
            <BestPriceCard />
            <Separator className="my-6" />
            <TripDetails />
            <Separator className="my-6" />
            <CheckoutSummary />
            <Separator className="my-6" />
            <CancellationPolicy />
            <Separator className="my-6" />
            <ContactInfo />
            <Separator className="my-6" />
            {/* <TermsAndSubmit /> */}
            <Separator className="my-6" />
            <StripePaymentInfo offer={{ property, request, ...offer }} />
            <CustomerReview />
            <div className="mt-4">
              <p className="text-sm">
                Questions?{" "}
                <span className="text-teal-900 underline">
                  <button
                    onClick={() => chatWithAdmin()}
                    className="text-blue-600 underline underline-offset-2"
                  >
                    Chat with host
                  </button>
                </span>
              </p>
            </div>
          </div>
        )}
        <div className="sticky top-24 hidden h-fit space-y-2 md:block md:pl-10 xl:pl-20">
          <div className="space-y-10">
            <CheckoutSummary />
            <CustomerReview />
          </div>
          <div>
            <p className="text-sm">
              Questions?{" "}
              <span className="text-teal-900 underline">
                <button
                  onClick={() => chatWithAdmin()}
                  className="text-blue-600 underline underline-offset-2"
                >
                  Chat with host
                </button>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OfferPriceDetails({
  offer,
}: {
  offer: Pick<Offer, "totalPrice" | "tramonaFee" | "checkIn" | "checkOut">;
}) {
  const numberOfNights = getNumNights(offer.checkIn, offer.checkOut);
  const nightlyPrice = offer.totalPrice / numberOfNights;
  const tax = (offer.totalPrice + offer.tramonaFee) * TAX_PERCENTAGE;
  const total = offer.totalPrice + offer.tramonaFee + tax;

  const items = [
    {
      title: `${formatCurrency(nightlyPrice)} x ${plural(numberOfNights, "night")}`,
      price: `${formatCurrency(offer.totalPrice)}`,
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
      price: `${formatCurrency(offer.tramonaFee)}`,
    },
    {
      title: "Taxes",
      price: `${formatCurrency(tax)}`,
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          className="flex items-center justify-between text-sm font-semibold"
          key={index}
        >
          <p className="underline">{item.title}</p>
          <p>{item.price}</p>
        </div>
      ))}
      <Separator />
      <div className="flex items-center justify-between pb-4 font-bold">
        <p>Total (USD)</p>
        <p>{formatCurrency(total)}</p>
      </div>
    </div>
  );
}
