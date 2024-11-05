import { ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Separator } from "../ui/separator";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  getTravelerOfferedPrice,
  originalListingIdToRandomDiscount,
  useIsSm,
} from "@/utils/utils";
import {
  PropertyPageData,
  type RequestToBookDetails,
} from "../offers/PropertyPage";
import { formatDateMonthDay, plural } from "@/utils/utils";
import { useChatWithAdmin } from "@/utils/messaging/useChatWithAdmin";
import RequestToBookCustomStripeCheckout from "./RequestToBookCustomStripeCheckout";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import React from "react";
import { RequestToBookPriceDetails } from "../_common/RequestToBookPriceDetails";

export type RequestToBookPricing = {
  requestId: null;
  scrapeUrl: string | null;
  travelerOfferedPriceBeforeFees: number;
  datePriceFromAirbnb: number;
  checkIn: Date;
  checkOut: Date;
};

export default function RequestToBookCheckout({
  requestToBook,
  property,
}: {
  requestToBook: RequestToBookDetails;
  property: PropertyPageData;
}) {
  const router = useRouter();
  const isMobile = !useIsSm();

  const chatWithAdmin = useChatWithAdmin();

  const scrapedPrice = 23456;

  const randomDiscount = property.originalListingId
    ? originalListingIdToRandomDiscount(property.originalListingId)
    : null;

  let priceWithApplicableDiscount;
  if (property.requestToBookDiscountPercentage && property.requestToBookDiscountPercentage > 0) {
    priceWithApplicableDiscount =
      scrapedPrice * (100 - property.requestToBookDiscountPercentage) * 0.01;
  }

  const travelerOfferedPriceBeforeFees = getTravelerOfferedPrice({
    totalPrice: priceWithApplicableDiscount ?? scrapedPrice,
    travelerMarkup: 1.015,
  });

  const requestToBookPricing: RequestToBookPricing = {
    requestId: null,
    scrapeUrl: property.originalListingPlatform ?? null,
    travelerOfferedPriceBeforeFees,
    datePriceFromAirbnb: scrapedPrice,
    checkIn: requestToBook.checkIn,
    checkOut: requestToBook.checkOut,
  };

  const handleBackClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    router.back();
  };

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
        <div className="space-y-2 md:my-8">
          <h2 className="text-lg font-semibold">Your trip details</h2>
          <div className="text-sm">
            <p>Dates</p>
            <p className="font-bold">
              {formatDateMonthDay(requestToBook.checkIn)} -{" "}
              {formatDateMonthDay(requestToBook.checkOut)}
            </p>
          </div>
          <div className="text-sm">
            <p>Guests</p>
            <p className="font-bold">
              {plural(requestToBook.numGuests, "guest")}
            </p>
          </div>
        </div>
      </>
    );
  }

  function CancellationPolicy() {
    if (property.cancellationPolicy === null) return null;

    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Cancellation Policy</h3>
        <p className="text-sm font-semibold leading-5 text-muted-foreground">
          {getCancellationPolicyDescription(property.cancellationPolicy)}
        </p>
      </div>
    );
  }

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
          <RequestToBookPriceDetails
            property={property}
            requestToBookPricing={requestToBookPricing}
          />
        </div>
        <div className="rounded-md bg-teal-900 md:rounded-b-xl md:rounded-t-none">
          {property.requestToBookDiscountPercentage > 0 ? (
            <h2 className="py-1 text-center text-lg font-semibold text-white md:py-2">
              {property.requestToBookDiscountPercentage}% Off
            </h2>
          ) : randomDiscount && randomDiscount > 0 ? (
            <h2 className="py-1 text-center text-lg font-semibold text-white md:py-2">
              {randomDiscount}% Off
            </h2>
          ) : (
            <Separator />
          )}
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

  function ChatWithHost() {
    return (
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
    );
  }

  return (
    <div className="px-4 md:px-3">
      <div className="mb-4 flex items-center gap-2">
        <Link href="#" onClick={handleBackClick} className="contents">
          <ChevronLeft />
          <p className="font-semibold">Request to book</p>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
        <div className="hidden md:block">
          <BestPriceCard />
          <TripDetails />
          <Separator className="my-4" />
          <CancellationPolicy />
          <Separator className="my-4" />
          {!isMobile && (
            <RequestToBookCustomStripeCheckout
              property={property}
              requestToBook={requestToBook}
              requestToBookPricing={requestToBookPricing}
            />
          )}
        </div>
        <div className="md:hidden">
          <BestPriceCard />
          <Separator className="my-6" />
          <TripDetails />
          <Separator className="my-6" />
          <CheckoutSummary />
          <Separator className="my-6" />
          <CancellationPolicy />
          <Separator className="my-6" />
          {isMobile && (
            <RequestToBookCustomStripeCheckout
              property={property}
              requestToBook={requestToBook}
              requestToBookPricing={requestToBookPricing}
            />
          )}
          <Separator className="my-6" />
          <CustomerReview />
          <div className="mt-4">
            <ChatWithHost />
          </div>
        </div>
        <div className="sticky top-24 hidden h-fit space-y-2 md:block md:pl-10 xl:pl-20">
          <div className="space-y-10">
            <CheckoutSummary />
            <CustomerReview />
          </div>
          <div>
            <ChatWithHost />
          </div>
        </div>
      </div>
    </div>
  );
}
