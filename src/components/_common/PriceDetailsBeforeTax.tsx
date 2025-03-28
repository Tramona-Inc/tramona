import { Separator } from "../ui/separator";
import { formatCurrency, getNumNights } from "@/utils/utils";
import { plural } from "@/utils/utils";
import type {
  OfferWithDetails,
  PropertyPageData,
} from "@/components/propertyPages/PropertyPage";
import React, { useEffect, useState } from "react";
import {
  breakdownPaymentByOffer,
  getTravelerOfferedPrice,
} from "@/utils/payment-utils/paymentBreakdown";
import { getServiceFee } from "@/utils/payment-utils/payment-utils";
import type { RequestToBookDetails } from "../propertyPages/sidebars/actionButtons/RequestToBookBtn";
import { getApplicableBookItNowAndRequestToBookDiscountPercentage } from "../../utils/payment-utils/payment-utils";
import { PriceBreakdownOutput } from "../checkout/types";
import { api } from "@/utils/api";

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
    useState<PriceBreakdownOutput | null>(null);
  const [priceDetails, setPriceDetails] = useState<PriceDetails>({
    numberOfNights: 1,
    nightlyPrice: 0,
  });

  // Fetch dynamic max discount when property and requestToBook are present
  const { data: dynamicMaxDiscount } =
    api.properties.getMaxRequestToBookDiscount.useQuery(
      {
        propertyId: property?.id ?? 0,
        checkIn: requestToBook?.checkIn.toISOString() ?? "",
        checkOut: requestToBook?.checkOut.toISOString() ?? "",
      },
      {
        // Only run query when we have valid data
        enabled:
          !!property?.id &&
          !!requestToBook?.checkIn &&
          !!requestToBook?.checkOut,
        keepPreviousData: true,
      },
    );

  const scrapedPrice = 23456;

  let priceWithApplicableDiscount;
  if (requestToBook && property) {
    const applicableDiscount =
      getApplicableBookItNowAndRequestToBookDiscountPercentage(property);

    if (applicableDiscount && applicableDiscount > 0) {
      priceWithApplicableDiscount =
        scrapedPrice * (100 - applicableDiscount) * 0.01;
    } else if (dynamicMaxDiscount && dynamicMaxDiscount > 0) {
      // Use dynamic max discount instead of the static property value
      priceWithApplicableDiscount =
        scrapedPrice * (100 - dynamicMaxDiscount) * 0.01;
    }
  }

  const calculatedTravelerPrice = getTravelerOfferedPrice({
    totalBasePriceBeforeFees: priceWithApplicableDiscount ?? scrapedPrice,
  });

  useEffect(() => {
    const calculatePayment = async () => {
      try {
        if (requestToBook && property) {
          const nights = getNumNights(
            requestToBook.checkIn,
            requestToBook.checkOut,
          );
          const nightly = calculatedTravelerPrice / nights;
          setPriceDetails({
            numberOfNights: nights,
            nightlyPrice: nightly,
          });

          const payment = breakdownPaymentByOffer({
            scrapeUrl: property.originalListingPlatform ?? null,
            calculatedTravelerPrice,
            datePriceFromAirbnb: scrapedPrice,
            checkIn: requestToBook.checkIn,
            checkOut: requestToBook.checkOut,
            property,
          });

          setBrokeDownPayment(payment);
        } else if (offer) {
          const nights = getNumNights(offer.checkIn, offer.checkOut);
          const nightly = offer.calculatedTravelerPrice / nights;
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
  }, [requestToBook, property, offer, scrapedPrice, calculatedTravelerPrice]);

  if (loading) {
    return <div>Loading price details...</div>;
  }

  if (!brokeDownPayment?.totalTripAmount) {
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
    // {
    //   title: "Cleaning fee",
    //   price: "Included",
    // },
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
            <p className="text-xs text-muted-foreground">Total before taxes</p>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <p className="text-base font-bold">
          {formatCurrency(
            brokeDownPayment.totalTripAmount - brokeDownPayment.taxesPaid,
          )}
        </p>
        <p className="text-xs text-muted-foreground">Total before taxes</p>
      </div>
    </>
  );
}
