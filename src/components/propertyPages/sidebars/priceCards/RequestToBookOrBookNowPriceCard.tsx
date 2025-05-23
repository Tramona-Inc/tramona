import { useState, useEffect, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatCurrency, getNumNights } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Info, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/router";
import PriceBreakdownForTravelers from "./PriceBreakdownForTravelers";

import PriceCardInformation from "./PriceCardInformation";
import BookNowBtn from "../actionButtons/BookNowBtn";
import RequestToBookBtn from "../actionButtons/RequestToBookBtn";
import { PropertyPageData } from "../../PropertyPage";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { isNumber } from "lodash";
import { useGetOriginalPropertyPricing } from "@/utils/payment-utils/useGetOriginalPropertyPricing";
import Link from "next/link";
import {
  MAX_REQUEST_TO_BOOK_PERCENTAGE,
  TRAVELER_MARKUP,
} from "@/utils/constants";

export type RequestToBookDetails = {
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  calculatedTravelerPrice?: number;
};

export default function RequestToBookOrBookNowPriceCard({
  property,
}: {
  property: PropertyPageData;
}) {
  const minDiscount = 0; //where we put host discounts

  const router = useRouter();
  const { query } = router;
  const checkIn = query.checkIn
    ? new Date(query.checkIn as string)
    : new Date();
  const checkOut = query.checkOut
    ? new Date(query.checkOut as string)
    : new Date();
  const numGuests = !query.numGuests
    ? property.maxNumGuests
    : parseInt(query.numGuests as string) > property.maxNumGuests
      ? property.maxNumGuests
      : parseInt(query.numGuests as string);

  // Fetch dynamic max discount based on selected dates
  const { data: dynamicMaxDiscount, isLoading: isMaxDiscountLoading } =
    api.properties.getMaxRequestToBookDiscount.useQuery(
      {
        propertyId: property.id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      },
      {
        enabled: !!checkIn && !!checkOut && checkIn < checkOut,
        keepPreviousData: true,
      },
    );

  // Use dynamic discount if available, otherwise fall back to static property value
  const maxDiscount =
    dynamicMaxDiscount !== undefined && dynamicMaxDiscount > 0
      ? dynamicMaxDiscount
      : 0;

  const { data: bookedDates } = api.calendar.getReservedDates.useQuery({
    propertyId: property.id,
  });

  // <---------------- Calculate the price here  ---------------->
  const numOfNights = getNumNights(checkIn, checkOut);
  const propertyPricing = useGetOriginalPropertyPricing({
    property,
    checkIn,
    checkOut,
    numGuests,
  });

  const calculatedTravelerPricePerNightWithoutFees =
    propertyPricing.calculatedBasePrice !== undefined
      ? (propertyPricing.calculatedBasePrice * TRAVELER_MARKUP) / numOfNights
      : undefined;

  const [error, setError] = useState<React.ReactNode | null>(null);

  const [errorState, setErrorState] = useState<{
    priceRequired?: boolean;
    priceAboveOriginal?: boolean;
    percentageAboveMax?: boolean;
  }>({});

  const [requestAmount, setRequestAmount] = useState(
    calculatedTravelerPricePerNightWithoutFees,
  );

  console.log(requestAmount);
  // Monitor `originalPrice` for errors
  useEffect(() => {
    if (calculatedTravelerPricePerNightWithoutFees === undefined) {
      setError(
        <>
          Original price is unavailable.
          <br />
          Please adjust your dates.
        </>,
      );
    } else {
      setError(null); // Clear the error when `originalPrice` is valid
      //setPropertyprice into state
      setRequestAmount(calculatedTravelerPricePerNightWithoutFees);
    }
  }, [calculatedTravelerPricePerNightWithoutFees]);

  // ----------------

  const initialRequestToBook: RequestToBookDetails = {
    checkIn: checkIn,
    checkOut: checkOut,
    numGuests: numGuests,
  };

  const [date, setDate] = useState({
    from: initialRequestToBook.checkIn,
    to: initialRequestToBook.checkOut,
  });
  const [unsetDate, setUnsetDate] = useState<{
    checkIn?: Date;
    checkOut?: Date;
  }>({
    checkIn: initialRequestToBook.checkIn,
    checkOut: initialRequestToBook.checkOut,
  });
  const [showPriceBreakdown, setShowPriceBreakdown] = useState<boolean>(false);
  const [hasOpenedRequestInput, setHasOpenedRequestInput] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showRequestInput, setShowRequestInput] = useState(false);

  const [requestPercentage, setRequestPercentage] = useState(0);
  const [selectedPresetType, setSelectedPresetType] = useState<
    "buyNow" | "request"
  >("buyNow");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    calculatedTravelerPricePerNightWithoutFees ?? null,
  );
  const [requestToBook, setRequestToBook] =
    useState<RequestToBookDetails>(initialRequestToBook);

  const [rawRequestAmount, setRawRequestAmount] = useState(
    calculatedTravelerPricePerNightWithoutFees
      ? formatCurrency(calculatedTravelerPricePerNightWithoutFees)
      : "",
  ); // Raw input for typing

  //price that isnt affecting the additioanlFees
  const [discountedPriceInfo, setDiscountedPriceInfo] = useState<{
    discountedTravelerPricePerNightWithoutFees?: number;
    finalDiscountedTravelerPrice?: number;
  }>({});

  useEffect(() => {
    if (query.checkIn && query.checkOut && query.numGuests) {
      const checkIn = new Date(query.checkIn as string);
      const checkOut = new Date(query.checkOut as string);
      const numGuests = !query.numGuests
        ? property.maxNumGuests
        : parseInt(query.numGuests as string) > property.maxNumGuests
          ? property.maxNumGuests
          : parseInt(query.numGuests as string);
      setDate({ from: checkIn, to: checkOut });
      setRequestToBook((prevState) => ({
        ...prevState,
        checkIn,
        checkOut,
        numGuests,
      }));
      console.log(requestAmount);
    }
  }, [
    query.checkIn,
    query.checkOut,
    query.numGuests,
    requestAmount,
    property.maxNumGuests,
  ]);

  const updateRequestToBook = (updates: Partial<RequestToBookDetails>) => {
    const isDateChange =
      updates.checkIn !== undefined || updates.checkOut !== undefined;

    setRequestToBook((prevState) => ({
      ...prevState,
      ...updates,
    }));

    // Update URL query params
    void router.push(
      {
        query: {
          ...query,
          ...updates,
          checkIn: updates.checkIn?.toISOString() ?? query.checkIn,
          checkOut: updates.checkOut?.toISOString() ?? query.checkOut,
        },
      },
      undefined,
      { shallow: true },
    );

    // If dates are changing, reset price-related states
    if (isDateChange) {
      // This resets everything when dates change
      setHasOpenedRequestInput(false);
      setSelectedPresetType("buyNow");
    }
  };

  const handleGuestChange = (value: string) => {
    const numGuests = parseInt(value);
    updateRequestToBook({ numGuests });
  };
  // Only set presetOptions if randomPrice is available
  const presetOptions = useMemo(() => {
    // If loading or missing price data, return empty array
    if (
      propertyPricing.isLoading ||
      propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes ===
        undefined ||
      calculatedTravelerPricePerNightWithoutFees === undefined
    ) {
      return [];
    }

    // Start with the Buy Now option
    const options = [
      {
        price:
          propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes,
        label: property.bookItNowEnabled ? "Buy Now" : "Original Price",
        percentOff: 0, // 0% off for original price
      },
    ];

    // Only add discount options if maxDiscount is greater than 0
    if (maxDiscount > 0) {
      options.push(
        {
          price: 0, // Placeholder, will be calculated below
          label: "Better request",
          percentOff: Math.ceil(maxDiscount / 2), // Use dynamic maxDiscount
        },
        {
          price: 0, // Placeholder, will be calculated below
          label: "Good request",
          percentOff: maxDiscount, // Use dynamic maxDiscount
        },
      );
    }

    return options.map((option) => {
      // Calculate price based on percentOff for "Better request" and "Good request"
      if (
        option.percentOff > 0 &&
        calculatedTravelerPricePerNightWithoutFees !== undefined
      ) {
        const discountedBasePricePerNight =
          calculatedTravelerPricePerNightWithoutFees *
          (1 - option.percentOff / 100);

        // Recalculate the full price by adding back all fees
        const finalPresetPrice =
          discountedBasePricePerNight * numOfNights +
          propertyPricing.additionalFees.totalAdditionalFees +
          (propertyPricing.brokedownPaymentOutput?.stripeTransactionFee ?? 0) +
          (propertyPricing.brokedownPaymentOutput?.superhogFee ?? 0);

        return {
          ...option,
          price: finalPresetPrice,
        };
      }
      return {
        ...option, // Keep "Buy Now" price as is
        price: option.price, // Keep original price if no discount
      };
    });
  }, [
    propertyPricing.isLoading,
    propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes,
    calculatedTravelerPricePerNightWithoutFees,
    property.bookItNowEnabled,
    maxDiscount,
    numOfNights,
    propertyPricing.additionalFees.totalAdditionalFees,
    propertyPricing.brokedownPaymentOutput?.stripeTransactionFee,
    propertyPricing.brokedownPaymentOutput?.superhogFee,
  ]);

  useEffect(() => {
    if (calculatedTravelerPricePerNightWithoutFees !== undefined) {
      const newPercentage = Math.round(
        ((calculatedTravelerPricePerNightWithoutFees - requestAmount!) /
          calculatedTravelerPricePerNightWithoutFees) *
          100,
      );
      setRequestPercentage(Math.max(minDiscount, Math.min(newPercentage)));

      // Calculate discounted base price per night (already in requestAmount)
      const discountedBasePricePerNight = requestAmount!;

      // Recalculate final discounted price (discounted base price * num nights + ALL fees)
      const finalDiscountedPrice =
        discountedBasePricePerNight * numOfNights +
        propertyPricing.additionalFees.totalAdditionalFees +
        (propertyPricing.brokedownPaymentOutput?.stripeTransactionFee ?? 0) +
        (propertyPricing.brokedownPaymentOutput?.superhogFee ?? 0);
      console.log(discountedBasePricePerNight);
      console.log(finalDiscountedPrice);

      setDiscountedPriceInfo({
        discountedTravelerPricePerNightWithoutFees: discountedBasePricePerNight, // This is requestAmount
        finalDiscountedTravelerPrice: finalDiscountedPrice,
      });

      console.log("set", finalDiscountedPrice);
    } else {
      setDiscountedPriceInfo({});
    }
  }, [
    requestAmount,
    calculatedTravelerPricePerNightWithoutFees,
    maxDiscount,
    numOfNights,
    propertyPricing.additionalFees.totalAdditionalFees,
    propertyPricing.brokedownPaymentOutput?.stripeTransactionFee, // Add as dependency
    propertyPricing.brokedownPaymentOutput?.superhogFee, // Add as dependency
  ]);

  const handleRequestChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Allow only valid currency format input or empty string
      if (/^\$?\d*(\.\d*)?$/.test(inputValue)) {
        const parsedValue = inputValue
          ? parseFloat(inputValue.replace(/[^0-9.]/g, ""))
          : 0;
        setRawRequestAmount(inputValue);

        setRequestAmount(parsedValue);
        setSelectedPreset(null);
      }
    },
    [setRawRequestAmount, setRequestAmount, setSelectedPreset],
  );

  const handleRequestBlur = () => {
    if (!requestAmount) {
      setErrorState({ priceRequired: true });
      return;
    }
    setErrorState({
      priceRequired: false,
      priceAboveOriginal:
        typeof requestAmount === "number" &&
        typeof calculatedTravelerPricePerNightWithoutFees === "number" &&
        requestAmount > calculatedTravelerPricePerNightWithoutFees,
      percentageAboveMax:
        typeof requestAmount === "number" &&
        typeof calculatedTravelerPricePerNightWithoutFees === "number" &&
        requestPercentage > MAX_REQUEST_TO_BOOK_PERCENTAGE,
    });
    setRawRequestAmount(formatCurrency(requestAmount)); // Format the value on blur
  };

  const handleSliderChange = (value: number[]) => {
    const newPercentage = value[0]!;
    setRequestPercentage(newPercentage);

    // Update preset type based on percentage - when at 0%, switch to buyNow
    setSelectedPresetType(newPercentage === 0 ? "buyNow" : "request");

    const newRequestAmount = Math.round(
      calculatedTravelerPricePerNightWithoutFees! * (1 - newPercentage / 100),
    );
    setRequestAmount(newRequestAmount); // Update requestAmount with per night base price
    setRawRequestAmount(formatCurrency(newRequestAmount)); // Keep raw input updated (though we might change this later)
    setSelectedPreset(null);
    setErrorState({});

    // Calculate final discounted price (discounted base price * num nights + original fees)
    const discountedBasePricePerNight = newRequestAmount;
    const finalDiscountedPrice =
      discountedBasePricePerNight * numOfNights +
      propertyPricing.additionalFees.totalAdditionalFees;

    setDiscountedPriceInfo({
      discountedTravelerPricePerNightWithoutFees: discountedBasePricePerNight,
      finalDiscountedTravelerPrice: finalDiscountedPrice,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the Delete or Backspace key was pressed
    if (e.key === "Delete" || e.key === "Backspace") {
      setRequestAmount(undefined);
      setRawRequestAmount("");
      setErrorState({});
      return;
    }
    if (e.key === "Enter") {
      handleRequestBlur();
    }
  };

  const getRequestLikelihood = () => {
    // Update to use dynamic maxDiscount
    if (requestPercentage <= maxDiscount * 0.1) {
      return "Good chance of acceptance";
    }
    if (requestPercentage <= maxDiscount * 0.5) {
      return "Moderate chance of acceptance";
    }
    return "Lower chance of acceptance";
  };

  const handlePresetSelect = useCallback(
    (
      price: number,
      isCurrentPreselect: boolean,
      option: { label: string; percentOff: number },
    ) => {
      if (isCurrentPreselect) return;

      // Determine if this is a buyNow option based on percentOff
      const isBuyNow = option.percentOff === 0;
      setSelectedPresetType(isBuyNow ? "buyNow" : "request");

      // `price` here is still the per night discounted base price from presetOptions
      console.log(price);
      setRequestAmount(price); // Set requestAmount to per night base price
      setRawRequestAmount(formatCurrency(price));
      const newPercentage = Math.round(
        ((calculatedTravelerPricePerNightWithoutFees! - price) /
          calculatedTravelerPricePerNightWithoutFees!) *
          100,
      );
      setRequestPercentage(
        Math.max(minDiscount, Math.min(newPercentage, maxDiscount)),
      );
      setSelectedPreset(price);
      setErrorState({});

      // Calculate final discounted price (discounted base price * num nights + original fees)
      const discountedBasePricePerNight = price;
      const finalDiscountedPrice =
        discountedBasePricePerNight * numOfNights +
        propertyPricing.additionalFees.totalAdditionalFees;

      setDiscountedPriceInfo({
        discountedTravelerPricePerNightWithoutFees: discountedBasePricePerNight,
        finalDiscountedTravelerPrice: finalDiscountedPrice,
      });
    },
    [
      calculatedTravelerPricePerNightWithoutFees,
      maxDiscount,
      numOfNights,
      propertyPricing.additionalFees.totalAdditionalFees,
    ],
  );

  // Check if showRequestInput is now true AND it's the first time
  useEffect(() => {
    if (
      !hasOpenedRequestInput &&
      !propertyPricing.isLoading &&
      presetOptions.length > 0
    ) {
      // Get the price of the first preset option (Buy Now/Original Price)
      const firstPresetPrice = presetOptions[0]?.price;
      const firstPresetOption = presetOptions[0];

      if (firstPresetPrice !== undefined && firstPresetOption) {
        handlePresetSelect(
          firstPresetPrice,
          false,
          firstPresetOption, // Pass the first preset option object (now guaranteed to exist)
        );
        setSelectedPreset(firstPresetPrice);
      }

      setHasOpenedRequestInput(true); // Mark that request input has been opened once
    }
  }, [
    hasOpenedRequestInput,
    presetOptions,
    handlePresetSelect,
    propertyPricing.isLoading,
  ]);

  return (
    <Card className="w-full bg-gray-50 shadow-lg">
      <CardContent className="flex flex-col gap-y-2 rounded-xl md:p-2 xl:p-6">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button className="grid w-full grid-cols-2 overflow-hidden rounded-lg border text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:grid-cols-1">
              <div className="border-r p-3 sm:border-r-0">
                <div className="text-sm text-muted-foreground">CHECK-IN</div>
                <div className="text-base font-medium">
                  {format(date.from, "MM/dd/yyyy")}
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm text-muted-foreground">CHECK-OUT</div>
                <div className="text-base font-medium">
                  {format(date.to, "MM/dd/yyyy")}
                </div>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={unsetDate.checkIn}
              selected={{
                from: unsetDate.checkIn,
                to: unsetDate.checkOut,
              }}
              onSelect={(selectedDate) => {
                if (selectedDate?.from && selectedDate.to) {
                  setDate({ from: selectedDate.from, to: selectedDate.to });
                  updateRequestToBook({
                    checkIn: selectedDate.from,
                    checkOut: selectedDate.to,
                  });
                  setIsCalendarOpen(false);
                }
                setUnsetDate({
                  checkIn: selectedDate?.from,
                  checkOut: selectedDate?.to,
                });
              }}
              numberOfMonths={2}
              disabled={(date) =>
                date < new Date() ||
                (bookedDates?.some((bookedDate) => {
                  return (
                    date >= new Date(bookedDate.start) &&
                    date <= new Date(bookedDate.end)
                  );
                }) ??
                  false)
              }
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full overflow-hidden rounded-lg border p-4 text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              )}
            >
              <div className="text-sm text-muted-foreground">GUESTS</div>
              <div className="text-base font-medium">
                {requestToBook.numGuests} guests
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <div className="w-[200px]">
                {Array.from({ length: property.maxNumGuests }, (_, index) => {
                  const num = index + 1; // Start from 1, not 0
                  return (
                    <div
                      key={num}
                      onClick={() => handleGuestChange(num.toString())} // Handle selection
                      className={cn(
                        "cursor-pointer rounded-lg p-1 hover:bg-gray-200",
                        requestToBook.numGuests === num && "font-semibold",
                      )}
                    >
                      {num} guest{num !== 1 ? "s" : ""}
                    </div>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {showRequestInput ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pricing Options</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      These options offer estimated chances of request
                      acceptance.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {isMaxDiscountLoading || propertyPricing.isLoading ? (
              <div className="grid grid-cols-3 gap-2 lg:gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              // Use flex layout when there's only one option, grid otherwise
              <div
                className={
                  presetOptions.length === 1
                    ? "flex justify-center"
                    : "grid grid-cols-3 gap-2 lg:gap-4"
                }
              >
                {presetOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handlePresetSelect(
                        calculatedTravelerPricePerNightWithoutFees! *
                          ((100 - option.percentOff) / 100),
                        requestPercentage === option.percentOff,
                        option, // Pass the full option object
                      )
                    }
                    className={cn(
                      "flex flex-col items-center justify-between rounded-lg border py-3 text-center transition-colors lg:p-4",
                      presetOptions.length === 1 ? "w-full max-w-md" : "", // Make button wider when it's the only option
                      requestPercentage === option.percentOff
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary/50",
                      option.label === "Book Now" && "font-semibold",
                    )}
                  >
                    <div className="lg:text-md text-sm font-bold">
                      {formatCurrency(option.price)}
                    </div>
                    <div className="text-xs leading-5 text-muted-foreground lg:text-sm">
                      {option.label}
                    </div>
                    {option.percentOff > 0 && (
                      <div className="w-full text-center text-xs font-medium text-green-600">
                        {option.percentOff}% off
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Only show Name Your Price section if maxDiscount > 0 and not loading */}
            {!isMaxDiscountLoading &&
              !propertyPricing.isLoading &&
              maxDiscount > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-medium italic text-muted-foreground">
                    Or Name Your Price
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <div className="flex flex-row items-end gap-x-2">
                          <Input
                            placeholder="Enter request"
                            value={
                              discountedPriceInfo.finalDiscountedTravelerPrice !==
                              undefined
                                ? formatCurrency(
                                    discountedPriceInfo.finalDiscountedTravelerPrice,
                                  ) // Display TOTAL discounted price (not per night)
                                : propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes !==
                                    undefined
                                  ? formatCurrency(
                                      propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes,
                                    ) // Display TOTAL original price when not discounted
                                  : ""
                            }
                            onChange={handleRequestChange}
                            onBlur={handleRequestBlur}
                            className="pl-7"
                            disabled
                            onKeyDown={handleKeyDown}
                          />
                          <p className="text-xs italic leading-tight text-muted-foreground">
                            total
                          </p>
                        </div>
                        {errorState.priceRequired && (
                          <p className="mx-2 mt-1 text-xs text-destructive">
                            Price is required
                          </p>
                        )}
                        {errorState.priceAboveOriginal && (
                          <p className="mx-1 mt-1 text-xs text-destructive">
                            Request is above the original price
                          </p>
                        )}
                        {errorState.percentageAboveMax && (
                          <p className="mx-1 mt-1 text-xs text-destructive">
                            Request cannot be more then{" "}
                            {MAX_REQUEST_TO_BOOK_PERCENTAGE}% of original price
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-medium text-green-600">
                          {Number.isNaN(requestPercentage)
                            ? ""
                            : `${requestPercentage}% off`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="relative">
                        <Slider
                          value={[requestPercentage]}
                          onValueChange={handleSliderChange}
                          max={maxDiscount} // Use the dynamic maxDiscount value
                          min={minDiscount}
                          step={1}
                          className="w-full"
                        />
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to right, #22c55e, #ef4444)",
                            opacity: 0.2,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div>High Acceptance Probability</div>
                        <div>Low Acceptance Probability</div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "text-center text-sm font-medium",
                        requestPercentage <= 10
                          ? "text-green-600"
                          : requestPercentage <= 15
                            ? "text-yellow-600"
                            : "text-red-600",
                      )}
                    >
                      {getRequestLikelihood()}
                    </div>
                  </div>
                </div>
              )}

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Hosts have 24 hours to accept or reject your request.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Accepted requests will be automatically booked.</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                <span>
                  You can place multiple requests. Overlapping requests will be
                  canceled if one is accepted.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Show Book Now button when property is book it now enabled AND either:
                  1. Selected preset type is buyNow, OR
                  2. There's no discount available (maxDiscount is 0) */}
              {property.bookItNowEnabled &&
              (selectedPresetType === "buyNow" || maxDiscount === 0) ? (
                <BookNowBtn property={property} requestToBook={requestToBook} />
              ) : (
                <RequestToBookBtn
                  btnSize="sm"
                  requestToBook={requestToBook}
                  property={property}
                  requestPercentage={requestPercentage}
                  invalidInput={
                    !rawRequestAmount ||
                    !requestAmount ||
                    !calculatedTravelerPricePerNightWithoutFees ||
                    requestAmount > calculatedTravelerPricePerNightWithoutFees
                  }
                />
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRequestInput(false)}
              >
                Cancel request
              </Button>
            </div>
          </div>
        ) : propertyPricing.isLoading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isNumber(calculatedTravelerPricePerNightWithoutFees) &&
          propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes ? (
          <>
            <div>
              <div className="mb-1 text-2xl font-bold">Book it now for</div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline">
                <div className="text-4xl font-bold text-primary lg:text-5xl">
                  {propertyPricing.amountSaved !== undefined &&
                  propertyPricing.amountSaved > 0 ? ( // Only show original price strikethrough when NOT in request input and discount exists
                    <div className="flex flex-col gap-2 text-base sm:flex-row sm:items-start">
                      <p className="text-3xl">
                        {formatCurrency(
                          propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes,
                        )}
                      </p>
                      <p className="text-muted-foreground line-through">
                        {formatCurrency(
                          propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes +
                            propertyPricing.amountSaved,
                        )}
                      </p>
                    </div>
                  ) : (
                    <span>
                      {formatCurrency(
                        propertyPricing.travelerCalculatedAmountWithSecondaryLayerWithoutTaxes /
                          numOfNights, // Otherwise display original calculated price
                      )}
                    </span>
                  )}
                </div>
                {/* <span className="mt-2 text-xl text-muted-foreground sm:ml-2 sm:mt-0">
                  Per Night
                </span> */}
              </div>
              {property.randomPercentageForScrapedProperties && (
                <div className="my-3 text-xs md:text-sm">
                  Save{" "}
                  <span className="text-green-700">
                    {property.randomPercentageForScrapedProperties}%{" "}
                  </span>
                  on fees compared to other{" "}
                  <span className="text-destructive">platforms</span>!
                </div>
              )}
              <Button
                variant="link"
                className="mt-1 flex items-center gap-1 px-0 text-muted-foreground"
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
              >
                Price Breakdown
                {showPriceBreakdown ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {showPriceBreakdown && (
                <PriceBreakdownForTravelers
                  propertyPricing={propertyPricing}
                  numNights={numOfNights}
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-1 sm:grid-cols-1">
              <Button
                variant="outline"
                className={`col-auto w-full px-2 text-sm tracking-tight lg:text-base ${
                  !property.bookItNowEnabled ? "col-span-2" : ""
                }`}
                onClick={() => setShowRequestInput(true)}
              >
                Place request
              </Button>
              {property.bookItNowEnabled && (
                <BookNowBtn property={property} requestToBook={requestToBook} />
              )}
            </div>
          </>
        ) : (
          <></>
        )}
        <p className="my-1 text-center text-sm text-muted-foreground">
          You won&apos;t be charged yet
        </p>
        <Link
          href="/why-list"
          className="block text-center text-primary hover:underline"
        >
          Have a property? List now →
        </Link>
        <PriceCardInformation />
      </CardContent>
    </Card>
  );
}
