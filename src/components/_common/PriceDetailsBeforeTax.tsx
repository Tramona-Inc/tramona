import { Separator } from "../ui/separator";
import {
  formatCurrency,
  getNumNights,
  getTravelerOfferedPrice,
} from "@/utils/utils";
import { plural } from "@/utils/utils";
import type {
  OfferWithDetails,
  PropertyPageData,
  RequestToBookDetails,
} from "@/components/offers/PropertyPage";
import React, { useEffect, useState } from "react";
import {
  breakdownPayment,
  getServiceFee,
} from "@/utils/payment-utils/paymentBreakdown";

type PaymentBreakdown = {
  totalTripAmount: number;
  paymentIntentId: string;
  taxesPaid: number;
  taxPercentage: number;
  superhogFee: number;
  stripeTransactionFee: number;
  checkoutSessionId: string;
  totalSavings: number;
};

export default function PriceDetailsBeforeTax({
  bookOnAirbnb, /// do we need this?
  offer,
  requestToBook,
  property,
}: {
  bookOnAirbnb?: boolean;
  offer?: OfferWithDetails;
  requestToBook?: RequestToBookDetails;
  property?: PropertyPageData;
}) {
  const [loading, setLoading] = useState(true);
  const [brokeDownPayment, setBrokeDownPayment] = 
    useState<PaymentBreakdown | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (requestToBook && property) {
        try {
          const numberOfNights = getNumNights(
            requestToBook.checkIn,
            requestToBook.checkOut,
          );
          
          const travelerOfferedPriceBeforeFees = getTravelerOfferedPrice({
            propertyPrice: 12345, // This needs to be updated with actual price
            travelerMarkup: 1.015,
            numNights: numberOfNights,
          });

          console.log('sup')

          const payment = await breakdownPayment({
            numOfNights: numberOfNights,
            travelerOfferedPriceBeforeFees,
            isScrapedPropery: true,
            // lat: property.latLngPoint.x,
            // lng: property.latLngPoint.y,
          });
          console.log(payment)

          setBrokeDownPayment(payment);
        } catch (error) {
          console.error("Error fetching payment breakdown");
        } finally {
          setLoading(false);
        }
      }
    };

    void fetchData();
  }, [requestToBook, property]);

  if (loading && requestToBook) {
    return <div>Loading price details...</div>;
  }

  let priceDetails;
  if (offer) {
    const numberOfNights = getNumNights(offer.checkIn, offer.checkOut);
    const nightlyPrice = offer.travelerOfferedPriceBeforeFees / numberOfNights;
    
    priceDetails = {
      numberOfNights,
      nightlyPrice,
      serviceFee: getServiceFee({ tripCheckout: offer.tripCheckout }),
      totalAmount: offer.tripCheckout.totalTripAmount - offer.tripCheckout.taxesPaid,
      isScraped: !!offer.scrapeUrl,
    };
  } else if (brokeDownPayment && requestToBook) {
    const numberOfNights = getNumNights(requestToBook.checkIn, requestToBook.checkOut);
    const nightlyPrice = brokeDownPayment.totalTripAmount / numberOfNights;
    
    priceDetails = {
      numberOfNights,
      nightlyPrice,
      //can update the getServiceFee util instead
      serviceFee: brokeDownPayment.superhogFee + brokeDownPayment.stripeTransactionFee,
      totalAmount: brokeDownPayment.totalTripAmount - brokeDownPayment.taxesPaid,
      isScraped: true,
    };
    console.log('brokedownpayment', priceDetails)
  } else {
    return null;
  }



  const items = [
    {
      title: `${formatCurrency(priceDetails.nightlyPrice)} x ${plural(priceDetails.numberOfNights, "night")}`,
      price: formatCurrency(priceDetails.nightlyPrice * priceDetails.numberOfNights),
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
      price: formatCurrency(priceDetails.serviceFee),
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
            <p>{formatCurrency(priceDetails.totalAmount)}</p>
          </div>
          {!priceDetails.isScraped && (
            <p className="text-sm text-muted-foreground">Total before taxes</p>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <p className="text-base font-bold">
          {formatCurrency(priceDetails.totalAmount)}
        </p>
        {!priceDetails.isScraped && (
          <p className="text-muted-foreground">Total before taxes</p>
        )}
      </div>
    </>
  );
}