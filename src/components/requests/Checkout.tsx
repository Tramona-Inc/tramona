import { ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "@/utils/utils";
import Stripe from "stripe";
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

export default function Checkout() {
  const router = useRouter();

  const handleBackClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    router.back();
  };

  const items = [
    {
      title: "$2,085 x 5 nights",
      price: 10423,
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
      price: 0,
    },
    {
      title: "Taxes",
      price: 93.72,
    },
  ];

  function BestPriceCard() {
    return (
      <div className="rounded-lg border border-teal-900 bg-zinc-100 p-3 text-sm">
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
        <div className="space-y-2 sm:my-8">
          <h2 className="text-lg font-semibold">Your trip details</h2>
          <div className="text-sm">
            <p>Dates</p>
            <p className="font-bold">July 1 - Aug 5</p>
          </div>
          <div className="text-sm">
            <p>Guests</p>
            <p className="font-bold">2 guests</p>
          </div>
        </div>
      </>
    );
  }

  function CancellationPolicy() {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Cancellation Policy</h3>
        <p className="text-sm font-semibold leading-5 text-muted-foreground">
          This is an exclusive price only available on Tramona. This is an
          exclusive price only available on Tramona. This is an exclusive price
          only available on Tramona.
        </p>
      </div>
    );
  }

  function StripePaymentInfo() {
    return <div>insert stripe checkout form here</div>;
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
                  <Input {...field} autoFocus />
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
                  <Input {...field} autoFocus />
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
      <div className="sm:mt-8">
        <div className="mb-8 space-y-4 text-muted-foreground">
          <p className="text-sm font-semibold leading-5">
            On behalf of Tramona we ask that you please follow the house rules
            and treat the house as if it were your own
          </p>
          <p className="px-2 text-xs sm:px-0">
            By selecting the button, I agree to the booking terms. I also agree
            to the Terms of Service, Payment Terms of Service and I acknowledge
            the Privacy Policy
          </p>
        </div>
        <Button variant="greenPrimary" className="my-2 w-full font-semibold">
          Confirm and pay
        </Button>
        <p className="my-4 text-center text-xs font-semibold text-muted-foreground sm:my-0">
          As soon as you book you will get an email and text confirmation with
          all booking details
        </p>
      </div>
    );
  }

  function CheckoutSummary() {
    return (
      <div>
        <div className="sm:rounded-t-xl sm:border sm:border-b-0 sm:p-3">
          <h2 className="mb-4 text-lg font-semibold sm:hidden">
            Price Details
          </h2>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="/assets/images/landing-bg.jpg"
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold">
                  Entire Cabin in Gold Bar, Washington
                </h3>
                <p className="text-xs">Apartment</p>
                <div className="flex items-center gap-1">
                  <Star size={10} />
                  <p className="text-xs">4.89 (147 reviews)</p>
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
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                className="flex items-center justify-between text-sm font-semibold"
                key={index}
              >
                <p className={cn(index !== 3 && "underline")}>{item.title}</p>
                <p>
                  {index !== 1 ? "$" : ""}
                  {item.price}
                </p>
              </div>
            ))}
          </div>
          <div className="hidden sm:block">
            <Separator className="my-4" />
          </div>
          <div className="my-4 flex items-center justify-between text-sm font-bold sm:my-0 sm:font-semibold">
            <p>Total (USD)</p>
            <p>$957.25</p>
          </div>
        </div>
        <div className="rounded-lg bg-teal-900 sm:rounded-b-xl sm:rounded-t-none">
          <h2 className="py-1 text-center text-lg font-semibold text-white sm:py-2">
            15% Off
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
          <div className="space-y-2 rounded-xl bg-primary/60 p-3 text-sm text-white">
            <p>
              &quot;My experience with Tramona has been wonderful. Any questions
              i have i hear back instantly, and the prices are truly unbeatable.
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
    <div className="px-4 sm:px-3">
      <div className="mb-4 sm:mb-8">
        <Link href="#" onClick={handleBackClick}>
          <div className="flex items-center gap-2">
            <ChevronLeft />
            <p className="font-semibold">Confirm and pay</p>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-20 sm:grid-cols-2">
        <div className="hidden sm:block">
          <BestPriceCard />
          <TripDetails />
          <Separator className="my-4" />
          <CancellationPolicy />
          <Separator className="my-4" />
          <StripePaymentInfo />
          <Separator className="my-4" />
          <ContactInfo />
          <Separator className="my-4" />
          <TermsAndSubmit />
        </div>
        <div className="sm:hidden">
          <BestPriceCard />
          <Separator className="my-6" />
          <TripDetails />
          <Separator className="my-6" />
          <CheckoutSummary />
          <Separator className="my-6" />
          <StripePaymentInfo />
          <Separator className="my-6" />
          <CancellationPolicy />
          <Separator className="my-6" />
          <ContactInfo />
          <Separator className="my-6" />
          <TermsAndSubmit />
          <CustomerReview />
          <div className="mt-4">
            <p className="text-sm">
              Questions?{" "}
              <span className="text-teal-900 underline">
                <Link href="/">Chat with host</Link>
              </span>
            </p>
          </div>
        </div>
        <div className="hidden space-y-2 sm:block sm:pl-20">
          <div className="space-y-10">
            <CheckoutSummary />
            <CustomerReview />
          </div>
          <div>
            <p className="text-sm">
              Questions?{" "}
              <span className="text-teal-900 underline">
                <Link href="/">Chat with host</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
