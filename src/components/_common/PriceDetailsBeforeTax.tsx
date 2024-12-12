import { Separator } from "../ui/separator";
import {
  formatCurrency,
  getApplicableBookItNowDiscount,
  getNumNights,
  getTravelerOfferedPrice,
} from "@/utils/utils";
import { plural } from "@/utils/utils";
import type {
  OfferWithDetails,
  PropertyPageData,
} from "@/components/propertyPages/PropertyPage";
import React, { useEffect, useState } from "react";
import {
  breakdownPaymentByOffer,
  getServiceFee,
} from "@/utils/payment-utils/paymentBreakdown";
import type { RequestToBookDetails } from "../propertyPages/sidebars/actionButtons/RequestToBookBtn";

type PaymentBreakdown = {
  totalTripAmount: number;
  taxesPaid: number;
  taxPercentage: number;
  superhogFee: number;
  stripeTransactionFee: number;
  totalSavings: number;
};

type PriceDetails = {
  numberOfNights: number;
  nightlyPrice: number;
};

export default function PriceDetailsBeforeTax({
  offer,
  requestToBook,
  property,
}: {
  offer?: OfferWithDetails;
  requestToBook?: RequestToBookDetails;
  property?: PropertyPageData;
}) {
  const [loading, setLoading] = useState(true);
  const [brokeDownPayment, setBrokeDownPayment] =
    useState<PaymentBreakdown | null>(null);
  const [priceDetails, setPriceDetails] = useState<PriceDetails>({
    numberOfNights: 1,
    nightlyPrice: 0,
  });

  const scrapedPrice = 23456;

  let priceWithApplicableDiscount;
  if (requestToBook && property) {
    const applicableDiscount = getApplicableBookItNowDiscount({
      bookItNowDiscountTiers: property.bookItNowDiscountTiers,
      checkIn: requestToBook.checkIn,
    });

    if (applicableDiscount && applicableDiscount > 0) {
      priceWithApplicableDiscount =
        scrapedPrice * (100 - applicableDiscount) * 0.01;
    } else if (
      property.requestToBookMaxDiscountPercentage &&
      property.requestToBookMaxDiscountPercentage > 0
    ) {
      priceWithApplicableDiscount =
        scrapedPrice *
        (100 - property.requestToBookMaxDiscountPercentage) *
        0.01;
    }
  }

  const travelerOfferedPriceBeforeFees = getTravelerOfferedPrice({
    totalPrice: priceWithApplicableDiscount ?? scrapedPrice,
    travelerMarkup: 1.015,
  });

  useEffect(() => {
    const calculatePayment = async () => {
      try {
        if (requestToBook && property) {
          const nights = getNumNights(
            requestToBook.checkIn,
            requestToBook.checkOut,
          );
          const nightly = travelerOfferedPriceBeforeFees / nights;
          setPriceDetails({
            numberOfNights: nights,
            nightlyPrice: nightly,
          });

          const payment = breakdownPaymentByOffer({
            scrapeUrl: property.originalListingPlatform ?? null,
            travelerOfferedPriceBeforeFees,
            datePriceFromAirbnb: scrapedPrice,
            checkIn: requestToBook.checkIn,
            checkOut: requestToBook.checkOut,
            property,
          });

          setBrokeDownPayment(payment);
        } else if (offer) {
          const nights = getNumNights(offer.checkIn, offer.checkOut);
          const nightly = offer.travelerOfferedPriceBeforeFees / nights;
          setPriceDetails({
            numberOfNights: nights,
            nightlyPrice: nightly,
          });

          const payment = breakdownPaymentByOffer(offer);
          setBrokeDownPayment(payment);
        } else {
          throw new Error("Missing required booking information");
        }
      } catch (error) {
        console.error("Error fetching payment breakdown:", error);
        setBrokeDownPayment(null);
      } finally {
        setLoading(false);
      }
    };

    void calculatePayment();
  }, [
    requestToBook,
    property,
    offer,
    scrapedPrice,
    travelerOfferedPriceBeforeFees,
  ]);

  if (loading) {
    return <div>Loading price details...</div>;
  }

  if (!brokeDownPayment) {
    return (
      <div className="text-red-500">{"Unable to display price details"}</div>
    );
  }

  const items = [
    {
      title: `${formatCurrency(priceDetails.nightlyPrice)} x ${plural(priceDetails.numberOfNights, "night")}`,
      price: formatCurrency(
        priceDetails.nightlyPrice * priceDetails.numberOfNights,
      ),
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
      price: formatCurrency(getServiceFee({ tripCheckout: brokeDownPayment })),
    },
  ];

  return (
    <>
      <div className="hidden space-y-3 md:block">
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
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center justify-between font-bold">
            <p>Total (USD)</p>
            <p>
              {formatCurrency(
                brokeDownPayment.totalTripAmount - brokeDownPayment.taxesPaid,
              )}
            </p>
          </div>
          {offer && !offer.scrapeUrl && (
            <p className="text-sm text-muted-foreground">Total before taxes</p>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <p className="text-base font-bold">
          {formatCurrency(
            brokeDownPayment.totalTripAmount - brokeDownPayment.taxesPaid,
          )}
        </p>
        <p className="text-muted-foreground">Total before taxes</p>
      </div>
    </>
  );
}
