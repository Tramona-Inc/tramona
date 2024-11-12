import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Separator } from "../ui/separator";
import React from "react";
import { useIsSm } from "@/utils/utils";
import ChatWithHost from "./sections/ChatWithHost";
import CustomerReview from "./sections/CustomerReview";
import MemoizedCustomStripeCheckoutContainer from "./CustomStripeCheckoutContainer";
import BestPriceCard from "./sections/BestPriceCard";
import { UnifiedCheckoutData } from "./types";
import TripDetails from "./sections/TripDetails";
import CancellationPolicy from "./sections/CancellationPolicy";
import CheckoutSummary from "./sections/CheckoutSummary";
import { useSession } from "next-auth/react";

interface UnifiedCheckoutProps {
  unifiedCheckoutData: UnifiedCheckoutData;
}

////// --------------------------------------- THIS CHECKOUT WORKS FOR BOOK IT NOW, OFFERS, REQUEST TO BOOK (First needs to be modified by its respective page) ------------------------------------------
export function UnifiedCheckout({ unifiedCheckoutData }: UnifiedCheckoutProps) {
  useSession({ required: true });
  const router = useRouter();
  const isMobile = !useIsSm();

  const renderCheckoutForm = () => {
    //if (isMobile) return null;
    return (
      <MemoizedCustomStripeCheckoutContainer
        unifiedCheckoutData={unifiedCheckoutData}
      />
    );
  };

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
          <p className="font-semibold">{unifiedCheckoutData.property.name}</p>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-20">
        <div className="hidden md:block">
          <BestPriceCard />
          <TripDetails unifiedCheckoutData={unifiedCheckoutData} />
          <Separator className="my-4" />
          <CancellationPolicy unifiedCheckoutData={unifiedCheckoutData} />
          <Separator className="my-4" />
          {!isMobile && renderCheckoutForm()}
        </div>
        <div className="md:hidden">
          <BestPriceCard />
          <Separator className="my-6" />
          <TripDetails unifiedCheckoutData={unifiedCheckoutData} />
          <Separator className="my-6" />
          <CheckoutSummary unifiedCheckoutData={unifiedCheckoutData} />
          <Separator className="my-6" />
          <CancellationPolicy unifiedCheckoutData={unifiedCheckoutData} />
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
            <CheckoutSummary unifiedCheckoutData={unifiedCheckoutData} />
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
