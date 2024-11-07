import { ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Separator } from "../ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import {
  getApplicableBookItNowDiscount,
  getTravelerOfferedPrice,
  originalListingIdToRandomDiscount,
  useIsSm,
  getOfferDiscountPercentage,
} from "@/utils/utils";
import { formatDateMonthDay, plural } from "@/utils/utils";
import { getCancellationPolicyDescription } from "@/config/getCancellationPolicyDescription";
import {
  type OfferWithDetails,
  type PropertyPageData,
} from "../propertyPages/PropertyPage";
import { RequestToBookPriceDetails } from "../_common/RequestToBookPriceDetails";
import { OfferPriceDetails } from "../_common/OfferPriceDetails";
import StripeCheckoutForm from "./StripeCheckoutForm";
import type { RequestToBookDetails } from "../propertyPages/RequestToBookPage";
import type { CheckoutData, RequestToBookPricing } from "./types";
import ChatWithHost from "./sections/ChatWithHost";
import CustomerReview from "./sections/CustomerReview";
import MemoizedCustomStripeCheckoutContainer from "./CustomStripeCheckoutContainer";
import BestPriceCard from "./sections/BestPriceCard";

type CheckoutType = "offer" | "requestToBook" | "bookNow";

type UnifiedCheckoutProps = {
  type: CheckoutType;
  offer?: OfferWithDetails;
  requestToBook?: RequestToBookDetails;
  property?: PropertyPageData;
};

export function UnifiedCheckout({
  type,
  offer,
  requestToBook,
  property,
}: UnifiedCheckoutProps) {
  const router = useRouter();
  const isMobile = !useIsSm();

  const getCheckoutData = (): CheckoutData => {
    if (type === "offer" && offer) {
      return {
        title: "Confirm and pay",
        dates: {
          checkIn: offer.checkIn,
          checkOut: offer.checkOut,
        },
        guests: offer.request?.numGuests ?? null,
        property: offer.property,
        pricing: null,
        discount: getOfferDiscountPercentage(offer),
      };
    }

    if (
      (type === "requestToBook" || type === "bookNow") &&
      requestToBook &&
      property
    ) {
      const scrapedPrice = 23456;
      const randomDiscount = property.originalListingId
        ? originalListingIdToRandomDiscount(property.originalListingId)
        : null;

      let priceWithApplicableDiscount;
      let applicableDiscount = 0;

      if (type === "bookNow") {
        applicableDiscount =
          getApplicableBookItNowDiscount({
            bookItNowDiscountTiers: property.bookItNowDiscountTiers,
            checkIn: requestToBook.checkIn,
          }) ?? 0;
      } else {
        applicableDiscount = property.requestToBookDiscountPercentage;
      }

      if (applicableDiscount > 0) {
        priceWithApplicableDiscount =
          scrapedPrice * (100 - applicableDiscount) * 0.01;
      }

      const travelerOfferedPriceBeforeFees = getTravelerOfferedPrice({
        totalPrice: priceWithApplicableDiscount ?? scrapedPrice,
        travelerMarkup: 1.015,
      });

      const pricing: RequestToBookPricing = {
        requestId: null,
        scrapeUrl: property.originalListingPlatform ?? null,
        travelerOfferedPriceBeforeFees,
        datePriceFromAirbnb: scrapedPrice,
        checkIn: requestToBook.checkIn,
        checkOut: requestToBook.checkOut,
      };

      return {
        title: type === "requestToBook" ? "Request to book" : "Book it now",
        dates: {
          checkIn: requestToBook.checkIn,
          checkOut: requestToBook.checkOut,
        },
        guests: requestToBook.numGuests,
        property,
        pricing,
        discount: applicableDiscount,
      };
    }

    throw new Error("Invalid checkout configuration");
  };

  const checkoutData = getCheckoutData();

  const renderCheckoutForm = () => {
    if (isMobile) return null;

    switch (type) {
      case "offer":
        return offer && <MemoizedCustomStripeCheckoutContainer offer={offer} />;
        // case "requestToBook":
        //   return (
        //     requestToBook &&
        //     property &&
        //     checkoutData.pricing && (
        //       <MemoizedCustomStripeCheckoutContainer
        //         property={property}
        //         requestToBook={requestToBook}
        //         requestToBookPricing={checkoutData.pricing}
        //       />
        //     )
        //   );
        // case "bookNow":
        //   return (
        //     requestToBook &&
        //     property &&
        //     checkoutData.pricing && (
        //       <MemoizedCustomStripeCheckoutContainer
        //         property={property}
        //         requestToBook={requestToBook}
        //         requestToBookPricing={checkoutData.pricing}
        //       />
        //     )
        //   );
        break;
    }
  };

  function TripDetails() {
    return (
      <div className="space-y-2 md:my-8">
        <h2 className="text-lg font-semibold">Your trip details</h2>
        <div className="text-sm">
          <p>Dates</p>
          <p className="font-bold">
            {formatDateMonthDay(checkoutData.dates.checkIn)} -{" "}
            {formatDateMonthDay(checkoutData.dates.checkOut)}
          </p>
        </div>
        <div className="text-sm">
          <p>Guests</p>
          <p className="font-bold">
            {plural(checkoutData.guests ?? 0, "guest")}
          </p>
        </div>
      </div>
    );
  }

  function CancellationPolicy() {
    const policy =
      type === "offer"
        ? offer?.property.cancellationPolicy
        : property?.cancellationPolicy;

    if (!policy) return null;

    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Cancellation Policy</h3>
        <p className="text-sm font-semibold leading-5 text-muted-foreground">
          {getCancellationPolicyDescription(policy)}
        </p>
      </div>
    );
  }

  function CheckoutSummary() {
    const currentProperty = type === "offer" ? offer?.property : property;
    if (!currentProperty) return null;

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
                  src={currentProperty.imageUrls[0]!}
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold">{currentProperty.name}</h3>
                <p className="text-xs">{currentProperty.propertyType}</p>
                <div className="flex items-center gap-1">
                  <Star size={10} />
                  <p className="text-xs">
                    {currentProperty.avgRating} (
                    {plural(currentProperty.numRatings, "review")})
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
          {type === "offer" && offer ? (
            <OfferPriceDetails offer={offer} />
          ) : (
            checkoutData.pricing &&
            property && (
              <RequestToBookPriceDetails
                property={property}
                requestToBookPricing={checkoutData.pricing}
              />
            )
          )}
        </div>
        <div className="rounded-md bg-teal-900 md:rounded-b-xl md:rounded-t-none">
          {checkoutData.discount > 0 ? (
            <h2 className="py-1 text-center text-lg font-semibold text-white md:py-2">
              {checkoutData.discount}% Off
            </h2>
          ) : (
            <Separator />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-3">
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
          className="contents"
        >
          <ChevronLeft />
          <p className="font-semibold">{checkoutData.title}</p>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
        <div className="hidden md:block">
          <BestPriceCard />
          <TripDetails />
          <Separator className="my-4" />
          <CancellationPolicy />
          <Separator className="my-4" />
          {!isMobile && renderCheckoutForm()}
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
          {isMobile && renderCheckoutForm()}
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
