import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  CheckCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useRouter } from "next/router";
import PriceBreakdown from "./PriceBreakdown";

import PriceCardInformation from "./PriceCardInformation";
import BookNowBtn from "../actionButtons/BookNowBtn";
import RequestToBookBtn from "../actionButtons/RequestToBookBtn";
import { PropertyPageData } from "../../PropertyPage";
import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { isNumber } from "lodash";
import { useGetOriginalPropertyPricing } from "@/utils/payment-utils/useGetOriginalPropertyPricing";

export type RequestToBookDetails = {
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  travelerOfferedPriceBeforeFees?: number;
};

export default function RequestToBookOrBookNowPriceCard({
  property,
}: {
  property: PropertyPageData;
}) {
  const minDiscount = 0; //where we put host discounts
  const maxDiscount = property.requestToBookMaxDiscountPercentage;

  const router = useRouter();
  const { query } = router;
  const checkIn = query.checkIn
    ? new Date(query.checkIn as string)
    : new Date();
  const checkOut = query.checkOut
    ? new Date(query.checkOut as string)
    : new Date();
  const numGuests = query.numGuests ? parseInt(query.numGuests as string) : 2;

  const { data: bookedDates } = api.calendar.getReservedDates.useQuery({
    propertyId: property.id,
  });

  // <---------------- Calculate the price here  ---------------->
  const propertyPricing = useGetOriginalPropertyPricing({
    property,
    checkIn,
    checkOut,
    numGuests,
  });

  const [error, setError] = useState<React.ReactNode | null>(null);
  const [requestAmount, setRequestAmount] = useState(
    propertyPricing.originalPrice,
  );
  // Monitor `originalPrice` for errors
  useEffect(() => {
    if (propertyPricing.originalPrice === undefined) {
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
      setRequestAmount(propertyPricing.originalPrice);
    }
  }, [propertyPricing.originalPrice]);

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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showRequestInput, setShowRequestInput] = useState(false);

  const [requestPercentage, setRequestPercentage] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [requestToBook, setRequestToBook] =
    useState<RequestToBookDetails>(initialRequestToBook);
  const [rawRequestAmount, setRawRequestAmount] = useState(""); // Raw input for typing

  console.log(requestAmount);
  useEffect(() => {
    if (query.checkIn && query.checkOut && query.numGuests) {
      const checkIn = new Date(query.checkIn as string);
      const checkOut = new Date(query.checkOut as string);
      const numGuests = parseInt(query.numGuests as string);
      setDate({ from: checkIn, to: checkOut });
      setRequestToBook((prevState) => ({
        ...prevState,
        checkIn,
        checkOut,
        numGuests,
      }));
      console.log(requestAmount);
    }
  }, [query.checkIn, query.checkOut, query.numGuests, requestAmount]);

  const updateRequestToBook = (updates: Partial<RequestToBookDetails>) => {
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
  };

  const handleGuestChange = (value: string) => {
    const numGuests = parseInt(value);
    updateRequestToBook({ numGuests });
  };
  const presetOptions = [
    {
      price: propertyPricing.originalPrice!,
      label: "Buy Now",
      percentOff: 0,
    },
    {
      price: propertyPricing.originalPrice! * 0.9,
      label: "Better request",
      percentOff: Math.ceil(property.requestToBookMaxDiscountPercentage / 2),
    },
    {
      price: propertyPricing.originalPrice! * 0.8,
      label: "Good request",
      percentOff: property.requestToBookMaxDiscountPercentage,
    },
  ];

  useEffect(() => {
    if (showRequestInput) {
      const newPercentage = Math.round(
        ((propertyPricing.originalPrice! - requestAmount!) /
          propertyPricing.originalPrice!) *
          100,
      );
      setRequestPercentage(
        Math.max(minDiscount, Math.min(newPercentage, maxDiscount)),
      );
    }
  }, [
    showRequestInput,
    requestAmount,
    propertyPricing.originalPrice,
    maxDiscount,
  ]);

  const handleRequestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow only numeric input or empty string
    if (/^\d*$/.test(inputValue)) {
      setRawRequestAmount(inputValue); // Update raw input state
      const parsedValue = inputValue ? parseInt(inputValue, 10) : 0;
      setRequestAmount(parsedValue); // Update parsed value
      setSelectedPreset(null);
    }
  };

  const handleRequestBlur = () => {
    setRawRequestAmount(formatCurrency(requestAmount!)); // Format the value on blur
  };
  const handleSliderChange = (value: number[]) => {
    const newRequestAmount = Math.round(
      propertyPricing.originalPrice! * (1 - value[0]! / 100),
    );
    setRequestAmount(newRequestAmount);
    setRawRequestAmount(formatCurrency(newRequestAmount));
    setRequestPercentage(value[0]!);
    setSelectedPreset(null);
  };

  const getRequestLikelihood = () => {
    if (
      requestPercentage <=
      property.requestToBookMaxDiscountPercentage * 0.1
    ) {
      return "Good chance of acceptance";
    }
    if (
      requestPercentage <=
      property.requestToBookMaxDiscountPercentage * 0.5
    ) {
      return "Moderate chance of acceptance";
    }
    return "Lower chance of acceptance";
  };

  const handlePresetSelect = (price: number) => {
    setRequestAmount(price);
    setRawRequestAmount(formatCurrency(price)); // Update raw input state

    const newPercentage = Math.round(
      ((propertyPricing.originalPrice! - price) /
        propertyPricing.originalPrice!) *
        100,
    );
    setRequestPercentage(
      Math.max(minDiscount, Math.min(newPercentage, maxDiscount)),
    );
    setSelectedPreset(price);
  };

  return (
    <Card className="w-full bg-gray-50 shadow-lg">
      <CardContent className="flex flex-col gap-y-2 rounded-xl md:p-2 xl:p-6">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button className="grid w-full grid-cols-2 overflow-hidden rounded-lg border text-left focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <div className="border-r p-3">
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
            <div className="grid grid-cols-3 gap-2 lg:gap-4">
              {presetOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    handlePresetSelect(
                      propertyPricing.originalPrice! *
                        ((100 - option.percentOff) / 100),
                    )
                  }
                  className={cn(
                    "flex flex-col items-center justify-between rounded-lg border py-3 text-center transition-colors lg:p-4",
                    selectedPreset === option.price
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-primary/50",
                    option.label === "Book Now" && "font-semibold",
                  )}
                >
                  <div className="lg:text-md text-sm font-bold">
                    {formatCurrency(
                      propertyPricing.originalPrice! *
                        ((100 - option.percentOff) / 100),
                    )}
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

            <div>
              <h3 className="mb-2 text-sm font-medium italic text-muted-foreground">
                Or Name Your Price
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">

                    </span> */}
                    <Input
                      placeholder="Enter request"
                      value={rawRequestAmount}
                      onChange={handleRequestChange}
                      onBlur={handleRequestBlur}
                      className="pl-7"
                    />
                  </div>
                  <div className="flex-1 text-right">
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
                      max={maxDiscount}
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
                      You can place multiple requests. Overlapping requests will
                      be canceled if one is accepted.
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <RequestToBookBtn
                    btnSize="sm"
                    requestToBook={requestToBook}
                    property={property}
                    requestPercentage={requestPercentage} // we are getting the request price by using the percentage and saving that in the url for the checkout to get the price
                  />
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowRequestInput(false)}
                  >
                    Cancel request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : propertyPricing.isLoading ? (
          <div className="space-y-2 p-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : isNumber(propertyPricing.originalPrice) ? (
          <>
            <div>
              <div className="mb-1 text-2xl font-bold">Book it now for</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary lg:text-5xl">
                  {formatCurrency(
                    propertyPricing.originalPrice /
                      getNumNights(checkIn, checkOut),
                  )}
                </span>
                <span className="text-xl text-muted-foreground">Per Night</span>
              </div>
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
                <PriceBreakdown
                  requestToBookDetails={requestToBook}
                  property={property}
                  requestAmount={requestAmount!} //
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-1">
              {property.bookItNowEnabled && (
                <BookNowBtn
                  btnSize="sm"
                  property={property}
                  requestToBook={requestToBook}
                />
              )}
              <Button
                variant="outline"
                className={`col-auto w-full px-2 text-sm tracking-tight lg:text-base ${
                  !property.bookItNowEnabled ? "col-span-2" : ""
                }`}
                onClick={() => setShowRequestInput(true)}
              >
                Place request
              </Button>
            </div>
          </>
        ) : propertyPricing.casamundoPrice === "unavailable" ? (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-red-500" />
              <div className="mb-1 text-2xl font-bold text-red-500">
                Dates Unavailable
              </div>
            </div>
            <p className="pb-4 text-center text-sm text-muted-foreground">
              The selected dates are no longer available. Try adjusting your
              search.
            </p>
            <p className="text-md pb-4 text-center text-muted-foreground">
              Pricing will update once new dates are selected.
            </p>
            <Button
              variant="darkPrimary"
              className="mt-2 flex min-w-full"
              onClick={() => setIsCalendarOpen(true)}
            >
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Change Dates
              </div>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-red-500" />
                <div className="mb-1 text-2xl font-bold text-red-500">
                  Sorry, an error occured
                </div>
              </div>
              <p className="pb-4 text-center text-sm text-muted-foreground">
                Please try again. If the error persists, send us a message using
                concierge or choose a new property.
              </p>
              <Button
                variant="darkPrimary"
                onClick={() => propertyPricing.refetchCasamundoPrice()}
              >
                Try Again
              </Button>
            </div>
          </>
        )}
        <p className="my-1 text-center text-sm text-muted-foreground">
          You won&apos;t be charged yet
        </p>
        <a href="#" className="block text-center text-primary hover:underline">
          Have a property? List now →
        </a>
        <PriceCardInformation />
      </CardContent>
    </Card>
  );
}
